import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminService } from '../services';

const TREES = [
  { id: '', label: 'All Trees', icon: '🌐' },
  { id: 'frontend', label: 'Frontend', icon: '🎨' },
  { id: 'backend', label: 'Backend', icon: '⚙️' },
  { id: 'algorithms', label: 'Algorithms', icon: '🧮' },
  { id: 'systemdesign', label: 'System Design', icon: '🏗️' },
];
const DIFFS = ['', 'beginner', 'intermediate', 'advanced', 'expert'];
const STATUSES = ['', 'pending', 'approved'];
const BADGES = ['', 'excellent', 'good', 'average', 'poor'];
const DIFF_COLORS = { beginner: '#00b894', intermediate: '#0984e3', advanced: '#e17055', expert: '#d63031' };

const BADGE_STYLES = {
  Excellent: { bg: '#00b894', text: '#ffffff', icon: '🏆' },
  Good: { bg: '#0984e3', text: '#ffffff', icon: '✨' },
  Average: { bg: '#f1c40f', text: '#2d3436', icon: '⚡' },
  Poor: { bg: '#d63031', text: '#ffffff', icon: '⚠️' },
};

export default function AdminChallenges() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [tree, setTree] = useState('');
  const [diff, setDiff] = useState('');
  const [status, setStatus] = useState('');
  const [badge, setBadge] = useState('');
  const [sortBy, setSortBy] = useState('score_desc');
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [expandedSlug, setExpandedSlug] = useState(null);
  const [highlightLowQuality, setHighlightLowQuality] = useState(true);
  const [aiReviewData, setAiReviewData] = useState(null);
  const [viewTab, setViewTab] = useState('list'); // 'list' or 'analytics'

  // Fetch generated challenges list
  const { data, isLoading } = useQuery({
    queryKey: ['admin-challenges', tree, diff, status, search, sortBy, badge],
    queryFn: async () => {
      const params = { sortBy };
      if (tree) params.tree = tree;
      if (diff) params.difficulty = diff;
      if (status) params.status = status;
      if (search) params.search = search;
      if (badge) params.badge = badge;
      const r = await adminService.listGenerated(params);
      return r.data.data;
    },
    keepPreviousData: true,
  });

  // Fetch analytics data
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const r = await adminService.getAnalytics();
      return r.data.data;
    },
    enabled: viewTab === 'analytics',
  });

  const challenges = data?.challenges || [];
  const stats = data?.stats || { total: 0, approved: 0, pending: 0 };

  // Mutations
  const approveMut = useMutation({
    mutationFn: ({ slug, approved }) => adminService.approveGenerated(slug, approved),
    onSuccess: () => { qc.invalidateQueries(['admin-challenges']); toast.success('Status updated'); },
  });
  const deleteMut = useMutation({
    mutationFn: (slug) => adminService.deleteGenerated(slug),
    onSuccess: () => { qc.invalidateQueries(['admin-challenges']); toast.success('Deleted'); },
  });
  const bulkMut = useMutation({
    mutationFn: ({ slugs, approved }) => adminService.approveBulk(slugs, approved),
    onSuccess: (_, v) => { qc.invalidateQueries(['admin-challenges']); setSelected(new Set()); toast.success(`${v.approved ? 'Approved' : 'Rejected'} ${v.slugs.length} challenges`); },
  });
  const importMut = useMutation({
    mutationFn: () => adminService.importApproved(),
    onSuccess: (r) => { 
      qc.invalidateQueries(['admin-challenges']); 
      if (r.data.data.errors && r.data.data.errors.length > 0) {
        toast.success(`Import completed: ${r.data.data.imported} imported, ${r.data.data.skipped} skipped.`);
        console.error('Import validation issues:', r.data.data.errors);
        toast.error(`${r.data.data.errors.length} challenges rejected due to schema/validation errors. Check logs.`);
      } else {
        toast.success(`Import complete! ${r.data.data.imported} challenges imported successfully.`);
      }
    },
    onError: (e) => toast.error(e.response?.data?.error || 'Import failed'),
  });
  const editMut = useMutation({
    mutationFn: ({ slug, data }) => adminService.editGenerated(slug, data),
    onSuccess: () => { qc.invalidateQueries(['admin-challenges']); setEditing(null); toast.success('Saved'); },
  });
  const scoreAllMut = useMutation({
    mutationFn: () => adminService.scoreAll(),
    onSuccess: (r) => { qc.invalidateQueries(['admin-challenges']); toast.success(`Recalculated all ${r.data.data.scored} scores`); },
  });
  const aiReviewMut = useMutation({
    mutationFn: (slug) => adminService.aiReview(slug),
    onSuccess: (r, slug) => { 
      setAiReviewData({ slug, ...r.data.data.review });
    },
    onError: (e) => toast.error(e.response?.data?.error || 'AI Review failed'),
  });

  const toggleSelect = (slug) => setSelected(prev => { const n = new Set(prev); n.has(slug) ? n.delete(slug) : n.add(slug); return n; });
  const selectAll = () => { if (selected.size === challenges.length) setSelected(new Set()); else setSelected(new Set(challenges.map(c => c.slug))); };

  const cardStyle = { background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' };
  const btnStyle = (bg, color = '#fff') => ({ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', background: bg, color, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' });
  const inputStyle = { padding: '0.625rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none', width: '100%' };
  const selectStyle = { ...inputStyle, width: 'auto', minWidth: 120, cursor: 'pointer' };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
      {/* Header */}
      <div className="page-header" style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ background: 'linear-gradient(135deg, #e17055, #d63031)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            🛡️ Challenge Review Dashboard
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Review, edit, approve, and import AI-generated challenges</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setViewTab('list')} style={btnStyle(viewTab === 'list' ? 'var(--accent-primary)' : 'var(--bg-secondary)', 'var(--text-primary)')}>
            📋 Challenges List
          </button>
          <button onClick={() => setViewTab('analytics')} style={btnStyle(viewTab === 'analytics' ? 'var(--accent-primary)' : 'var(--bg-secondary)', 'var(--text-primary)')}>
            📊 Analytics & Insights
          </button>
        </div>
      </div>

      {viewTab === 'analytics' ? (
        /* ANALYTICS TAB */
        <AnimatePresence mode="wait">
          {analyticsLoading ? (
            <div style={{ ...cardStyle, textAlign: 'center', padding: '4rem' }}>⏳ Loading analytics...</div>
          ) : !analytics ? (
            <div style={{ ...cardStyle, textAlign: 'center', padding: '4rem' }}>❌ Failed to load analytics</div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Analytics Stats Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {[
                  { label: 'Generated Challenges', value: analytics.generated, color: '#6c5ce7', icon: '🤖' },
                  { label: 'Approved & Pending Import', value: analytics.approved, color: '#00b894', icon: '✅' },
                  { label: 'Imported in MongoDB', value: analytics.imported, color: '#0984e3', icon: '🚀' },
                  { label: 'Avg Quality Score', value: `${analytics.avgQualityScore} / 100`, color: '#e17055', icon: '📈' },
                ].map(stat => (
                  <div key={stat.label} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '2rem' }}>{stat.icon}</span>
                    <div>
                      <p style={{ fontSize: '1.75rem', fontWeight: 800, color: stat.color }}>{stat.value}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quality Distribution */}
              <div style={{ ...cardStyle }}>
                <h3 style={{ marginBottom: '1rem' }}>🎯 Quality Score Distribution</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  {[
                    { label: 'Excellent (90-100)', count: analytics.qualityDistribution.excellent, color: '#00b894' },
                    { label: 'Good (75-89)', count: analytics.qualityDistribution.good, color: '#0984e3' },
                    { label: 'Average (60-74)', count: analytics.qualityDistribution.average, color: '#f1c40f' },
                    { label: 'Poor (<60)', count: analytics.qualityDistribution.poor, color: '#d63031' },
                    { label: 'Unscored', count: analytics.qualityDistribution.unscored, color: '#b2bec3' },
                  ].map(dist => (
                    <div key={dist.label} style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px', borderLeft: `4px solid ${dist.color}` }}>
                      <p style={{ fontSize: '1.25rem', fontWeight: 700, color: dist.color }}>{dist.count}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{dist.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Trees Table */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ ...cardStyle }}>
                  <h3 style={{ marginBottom: '1rem' }}>🌳 Challenges Per Skill Tree</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-primary)', textAlign: 'left' }}>
                        <th style={{ padding: '0.5rem' }}>Tree</th>
                        <th style={{ padding: '0.5rem' }}>Total</th>
                        <th style={{ padding: '0.5rem' }}>Approved</th>
                        <th style={{ padding: '0.5rem' }}>Avg Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(analytics.perTree).map(([treeKey, data]) => (
                        <tr key={treeKey} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                          <td style={{ padding: '0.5rem', textTransform: 'capitalize', fontWeight: 600 }}>{treeKey}</td>
                          <td style={{ padding: '0.5rem' }}>{data.total}</td>
                          <td style={{ padding: '0.5rem', color: '#00b894' }}>{data.approved}</td>
                          <td style={{ padding: '0.5rem', fontWeight: 700, color: data.avgScore >= 75 ? '#00b894' : '#e17055' }}>{data.avgScore}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ ...cardStyle }}>
                  <h3 style={{ marginBottom: '1rem' }}>⚡ Difficulty Distribution</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {Object.entries(analytics.perDifficulty).map(([diff, count]) => {
                      const total = analytics.generated || 1;
                      const percent = Math.round((count / total) * 100);
                      return (
                        <div key={diff}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                            <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{diff}</span>
                            <span style={{ color: 'var(--text-secondary)' }}>{count} ({percent}%)</span>
                          </div>
                          <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${percent}%`, background: DIFF_COLORS[diff] }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        /* CHALLENGES LIST TAB */
        <>
          {/* Stats Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Total Generated', value: stats.total, color: '#6c5ce7', icon: '📦' },
              { label: 'Pending Review', value: stats.pending, color: '#e17055', icon: '⏳' },
              { label: 'Approved for Import', value: stats.approved, color: '#00b894', icon: '✅' },
            ].map(s => (
              <div key={s.label} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem' }}>
                <span style={{ fontSize: '1.75rem' }}>{s.icon}</span>
                <div>
                  <p style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters Panel */}
          <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ flex: '1 1 250px' }}>
                <input placeholder="🔍 Search by title, slug, or tag..." value={search} onChange={e => setSearch(e.target.value)} style={inputStyle} />
              </div>
              <select value={tree} onChange={e => setTree(e.target.value)} style={selectStyle}>
                {TREES.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
              </select>
              <select value={diff} onChange={e => setDiff(e.target.value)} style={selectStyle}>
                <option value="">All Difficulties</option>
                {DIFFS.filter(Boolean).map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
              </select>
              <select value={status} onChange={e => setStatus(e.target.value)} style={selectStyle}>
                <option value="">All Approval Status</option>
                {STATUSES.filter(Boolean).map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
              <select value={badge} onChange={e => setBadge(e.target.value)} style={selectStyle}>
                <option value="">All Quality Badges</option>
                {BADGES.filter(Boolean).map(b => <option key={b} value={b}>{b.charAt(0).toUpperCase() + b.slice(1)}</option>)}
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={selectStyle}>
                <option value="score_desc">📈 Quality Score (High-Low)</option>
                <option value="score_asc">📉 Quality Score (Low-High)</option>
                <option value="title_asc">🔤 Title (A-Z)</option>
              </select>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', marginLeft: 'auto' }}>
                <input type="checkbox" checked={highlightLowQuality} onChange={e => setHighlightLowQuality(e.target.checked)} style={{ cursor: 'pointer' }} />
                ⚠️ Highlight Low Quality (&lt;60)
              </label>
            </div>
          </div>

          {/* Bulk Actions Panel */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem', alignItems: 'center' }}>
            <button onClick={selectAll} style={btnStyle('var(--bg-tertiary)', 'var(--text-primary)')}>
              {selected.size === challenges.length && challenges.length > 0 ? '☐ Deselect All' : '☑ Select All'}
            </button>
            {selected.size > 0 && (
              <>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{selected.size} selected</span>
                <button onClick={() => bulkMut.mutate({ slugs: [...selected], approved: true })} style={btnStyle('#00b894')}>✅ Bulk Approve</button>
                <button onClick={() => bulkMut.mutate({ slugs: [...selected], approved: false })} style={btnStyle('#e17055')}>❌ Bulk Reject</button>
              </>
            )}
            <button onClick={() => { if (confirm('Recalculate quality scores for all generated files?')) scoreAllMut.mutate(); }} style={btnStyle('var(--bg-tertiary)', 'var(--text-primary)')} disabled={scoreAllMut.isLoading}>
              {scoreAllMut.isLoading ? '⏳ Scoring...' : '⚙️ Recalculate Quality Scores'}
            </button>
            
            <div style={{ marginLeft: 'auto' }}>
              <button onClick={() => { if (confirm(`Import ${stats.approved} approved challenges into MongoDB? Rejected items will have validation errors detailed in console.`)) importMut.mutate(); }}
                disabled={stats.approved === 0 || importMut.isLoading}
                style={{ ...btnStyle(stats.approved > 0 ? 'linear-gradient(135deg, #6c5ce7, #a29bfe)' : '#555'), opacity: stats.approved === 0 ? 0.5 : 1 }}>
                {importMut.isLoading ? '⏳ Importing...' : `🚀 Import ${stats.approved} Approved`}
              </button>
            </div>
          </div>

          {/* Challenge List */}
          {isLoading ? (
            <div style={{ ...cardStyle, textAlign: 'center', padding: '3rem' }}>
              <span style={{ fontSize: '2rem' }}>⏳</span>
              <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Loading challenges...</p>
            </div>
          ) : challenges.length === 0 ? (
            <div style={{ ...cardStyle, textAlign: 'center', padding: '3rem' }}>
              <span style={{ fontSize: '2rem' }}>📭</span>
              <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>No generated challenges found matching the filters.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {challenges.map((c, i) => {
                const isLowQuality = c.qualityScore < 60;
                const highlight = highlightLowQuality && isLowQuality;
                const bs = BADGE_STYLES[c.qualityBadge] || { bg: '#b2bec3', text: '#2d3436', icon: '❓' };

                return (
                  <motion.div key={c.slug} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.01 }}
                    style={{ 
                      ...cardStyle, 
                      padding: 0, 
                      overflow: 'hidden', 
                      background: highlight ? 'rgba(214, 48, 49, 0.05)' : 'var(--bg-secondary)',
                      border: highlight 
                        ? '1px solid rgba(214, 48, 49, 0.6)' 
                        : c.approved 
                          ? '1px solid rgba(0, 184, 148, 0.3)' 
                          : '1px solid var(--border-primary)' 
                    }}
                  >
                    {/* Header Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1.25rem', cursor: 'pointer' }}
                      onClick={() => setExpandedSlug(expandedSlug === c.slug ? null : c.slug)}>
                      <input type="checkbox" checked={selected.has(c.slug)} onChange={() => toggleSelect(c.slug)} onClick={e => e.stopPropagation()}
                        style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#6c5ce7' }} />
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.approved ? '#00b894' : '#e17055', flexShrink: 0 }} />
                      
                      <span style={{ fontWeight: 700, flex: 1, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                        {c.title}
                        {highlight && <span style={{ marginLeft: '0.5rem', color: '#d63031', fontSize: '0.75rem', fontWeight: 600 }}>⚠️ Low Quality</span>}
                      </span>

                      {/* Quality Score Badge */}
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: 6, 
                        background: bs.bg, 
                        color: bs.text, 
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        {bs.icon} {c.qualityScore || 0}/100
                      </span>

                      <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: 6, background: `${DIFF_COLORS[c.difficulty]}20`, color: DIFF_COLORS[c.difficulty], fontWeight: 700 }}>
                        {c.difficulty}
                      </span>
                      <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: 6, background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {c._sourceFile?.replace('.json', '') || c.category}
                      </span>
                      <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', transition: 'transform 0.2s', transform: expandedSlug === c.slug ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
                    </div>

                    {/* Detail panel */}
                    <AnimatePresence>
                      {expandedSlug === c.slug && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          style={{ borderTop: '1px solid var(--border-primary)', overflow: 'hidden' }}>
                          
                          {/* Quality Score Breakdown Banner */}
                          {c.qualityBreakdown && (
                            <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border-primary)', display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>📊 Score breakdown:</span>
                              <span>🏷️ Title: <strong>{c.qualityBreakdown.title}/15</strong></span>
                              <span>🔗 Slug: <strong>{c.qualityBreakdown.slug}/10</strong></span>
                              <span>⚡ Diff: <strong>{c.qualityBreakdown.difficulty}/10</strong></span>
                              <span>🧪 Tests: <strong>{c.qualityBreakdown.testCases}/20</strong></span>
                              <span>💻 Code: <strong>{c.qualityBreakdown.starterCode}/15</strong></span>
                              <span>🏷️ Tags: <strong>{c.qualityBreakdown.tags}/10</strong></span>
                              <span>🌍 Relevance: <strong>{c.qualityBreakdown.relevance}/10</strong></span>
                              <span>⚠️ Unique: <strong>{c.qualityBreakdown.duplicate}/10</strong></span>
                            </div>
                          )}

                          <div style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {/* Left Column */}
                            <div>
                              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Description</p>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxHeight: 200, overflow: 'auto', background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 8 }}>
                                {c.description?.substring(0, 400)}{c.description?.length > 400 ? '...' : ''}
                              </div>
                              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {c.tags?.map(t => <span key={t} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: 4, background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{t}</span>)}
                              </div>
                            </div>
                            
                            {/* Right Column */}
                            <div>
                              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Starter Code (JS)</p>
                              <pre style={{ fontSize: '0.8rem', background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 8, overflow: 'auto', maxHeight: 100, color: '#a29bfe', margin: 0 }}>
                                {c.starterCode?.javascript}
                              </pre>
                              
                              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginTop: '0.75rem', marginBottom: '0.5rem' }}>
                                Test Cases ({c.testCases?.length || 0})
                              </p>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                {c.testCases?.map((tc, i) => (
                                  <div key={i} style={{ fontSize: '0.75rem', padding: '0.4rem 0.6rem', background: 'var(--bg-tertiary)', borderRadius: 6, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <span style={{ color: tc.isHidden ? '#e17055' : '#00b894', fontWeight: 700 }}>{tc.isHidden ? '🔒' : '👁️'}</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>{tc.input?.substring(0, 40)}</span>
                                    <span style={{ color: 'var(--text-tertiary)' }}>→</span>
                                    <span style={{ color: '#00b894' }}>{tc.expectedOutput?.substring(0, 30)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Detail Footer Actions */}
                          <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--border-primary)', display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.1)', alignItems: 'center' }}>
                            <button onClick={() => approveMut.mutate({ slug: c.slug, approved: !c.approved })}
                              style={btnStyle(c.approved ? '#e17055' : '#00b894')}>
                              {c.approved ? '❌ Reject / Unapprove' : '✅ Approve Challenge'}
                            </button>
                            <button onClick={() => setEditing({ ...c })} style={btnStyle('#0984e3')}>✏️ Edit Details</button>
                            <button onClick={() => aiReviewMut.mutate(c.slug)} style={btnStyle('linear-gradient(135deg, #6c5ce7, #a29bfe)')} disabled={aiReviewMut.isLoading}>
                              {aiReviewMut.isLoading && aiReviewMut.variables === c.slug ? '⏳ Analyzing...' : '🤖 AI Review & Improve'}
                            </button>
                            <button onClick={() => { if (confirm(`Delete "${c.title}"?`)) deleteMut.mutate(c.slug); }}
                              style={{ ...btnStyle('#d63031'), marginLeft: 'auto' }}>🗑️ Delete</button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
            onClick={() => setEditing(null)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              style={{ ...cardStyle, width: '100%', maxWidth: 700, maxHeight: '80vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>✏️ Edit Challenge</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Title</label>
                <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} style={inputStyle} />
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Slug</label>
                <input value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value })} style={inputStyle} />
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Difficulty</label>
                <select value={editing.difficulty} onChange={e => setEditing({ ...editing, difficulty: e.target.value })} style={selectStyle}>
                  {DIFFS.filter(Boolean).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Description</label>
                <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={6}
                  style={{ ...inputStyle, fontFamily: 'monospace', resize: 'vertical' }} />
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Starter Code (JS)</label>
                <textarea value={editing.starterCode?.javascript} onChange={e => setEditing({ ...editing, starterCode: { ...editing.starterCode, javascript: e.target.value } })} rows={4}
                  style={{ ...inputStyle, fontFamily: 'monospace', resize: 'vertical' }} />
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Starter Code (Python)</label>
                <textarea value={editing.starterCode?.python} onChange={e => setEditing({ ...editing, starterCode: { ...editing.starterCode, python: e.target.value } })} rows={4}
                  style={{ ...inputStyle, fontFamily: 'monospace', resize: 'vertical' }} />
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Tags (comma-separated)</label>
                <input value={editing.tags?.join(', ')} onChange={e => setEditing({ ...editing, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} style={inputStyle} />
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Hints (one per line)</label>
                <textarea value={editing.hints?.join('\n')} onChange={e => setEditing({ ...editing, hints: e.target.value.split('\n').filter(Boolean) })} rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', justifyContent: 'flex-end' }}>
                <button onClick={() => setEditing(null)} style={btnStyle('var(--bg-tertiary)', 'var(--text-primary)')}>Cancel</button>
                <button onClick={() => { const { _sourceFile, ...data } = editing; editMut.mutate({ slug: editing.slug, data }); }}
                  disabled={editMut.isLoading} style={btnStyle('linear-gradient(135deg, #6c5ce7, #a29bfe)')}>
                  {editMut.isLoading ? 'Saving...' : '💾 Save Changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Review Modal */}
      <AnimatePresence>
        {aiReviewData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
            onClick={() => setAiReviewData(null)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              style={{ ...cardStyle, width: '100%', maxWidth: 850, maxHeight: '85vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: 0 }}>🤖 AI Quality Review: {aiReviewData.slug}</h3>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: aiReviewData.overallScore >= 75 ? '#00b894' : '#e17055' }}>
                  AI Score: {aiReviewData.overallScore} / 100 ({aiReviewData.verdict})
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Issues Panel */}
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 8 }}>
                  <h4 style={{ color: '#d63031', marginTop: 0, marginBottom: '0.5rem' }}>⚠️ Detected Issues</h4>
                  {aiReviewData.issues?.length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No critical issues found.</p>
                  ) : (
                    <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {aiReviewData.issues?.map((issue, idx) => <li key={idx} style={{ marginBottom: '0.25rem' }}>{issue}</li>)}
                    </ul>
                  )}
                </div>

                {/* Suggestions Panel */}
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 8 }}>
                  <h4 style={{ color: '#0984e3', marginTop: 0, marginBottom: '0.5rem' }}>💡 Recommendations</h4>
                  <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {aiReviewData.suggestions?.map((sug, idx) => <li key={idx} style={{ marginBottom: '0.25rem' }}>{sug}</li>)}
                  </ul>
                </div>
              </div>

              {/* Side-by-Side Comparison Option */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>🔄 Improved Description Draft</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 8, maxHeight: 150, overflow: 'auto', fontFamily: 'monospace' }}>
                  {aiReviewData.improvedDescription}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <h4 style={{ marginBottom: '0.5rem' }}>⚡ Improved JavaScript Starter</h4>
                  <pre style={{ fontSize: '0.8rem', background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 8, overflow: 'auto', maxHeight: 150, color: '#a29bfe', margin: 0 }}>
                    {aiReviewData.improvedStarterCode?.javascript}
                  </pre>
                </div>
                <div>
                  <h4 style={{ marginBottom: '0.5rem' }}>🧪 Improved Test Cases ({aiReviewData.improvedTestCases?.length})</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', maxHeight: 150, overflow: 'auto' }}>
                    {aiReviewData.improvedTestCases?.map((tc, idx) => (
                      <div key={idx} style={{ fontSize: '0.75rem', padding: '0.4rem 0.6rem', background: 'var(--bg-tertiary)', borderRadius: 6 }}>
                        <span style={{ color: tc.isHidden ? '#e17055' : '#00b894', marginRight: '0.5rem' }}>{tc.isHidden ? '🔒' : '👁️'}</span>
                        <code>{tc.input} → {tc.expectedOutput}</code>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-primary)', paddingTop: '1.25rem' }}>
                <button onClick={() => setAiReviewData(null)} style={btnStyle('var(--bg-tertiary)', 'var(--text-primary)')}>Discard AI Suggestions</button>
                <button onClick={() => {
                  editMut.mutate({
                    slug: aiReviewData.slug,
                    data: {
                      title: aiReviewData.improvedTitle,
                      description: aiReviewData.improvedDescription,
                      starterCode: aiReviewData.improvedStarterCode,
                      testCases: aiReviewData.improvedTestCases,
                      hints: aiReviewData.improvedHints
                    }
                  });
                  setAiReviewData(null);
                }} style={btnStyle('linear-gradient(135deg, #00b894, #0984e3)')}>
                  💾 Apply & Accept AI Improvements
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
