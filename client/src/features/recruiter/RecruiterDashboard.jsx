import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { recruiterService } from '@/services';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatNumber } from '@/utils/helpers';
import toast from 'react-hot-toast';

export default function RecruiterDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ skill: '', minLevel: '', location: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, candidatesRes] = await Promise.all([
        recruiterService.getAnalytics(),
        recruiterService.searchTalent(filters)
      ]);
      setAnalytics(analyticsRes.data.data);
      setCandidates(candidatesRes.data.data.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  if (loading && !analytics) return <div className="page-container"><div className="skeleton skeleton-card"></div></div>;

  const COLORS = ['#6c5ce7', '#00cec9', '#f9ca24', '#ff6b6b', '#a855f7', '#74b9ff'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
      <div className="page-header">
        <h1>Recruiter Dashboard</h1>
        <p>Analyze talent pools and discover top developers.</p>
      </div>

      {analytics && (
        <>
          <div className="grid grid-3 mb-xl">
            <motion.div whileHover={{ y: -5 }} className="stat-card card-glass">
              <div className="stat-value">{formatNumber(analytics.totalDevelopers)}</div>
              <div className="stat-label">Total Developers</div>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="stat-card card-glass">
              <div className="stat-value">{Math.round(analytics.avgLevel)}</div>
              <div className="stat-label">Average Level</div>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="stat-card card-glass">
              <div className="stat-value">{formatNumber(Math.round(analytics.avgXP))}</div>
              <div className="stat-label">Average XP</div>
            </motion.div>
          </div>

          <div className="card mb-xl">
            <h3 className="mb-md">Top Skills in Demand</h3>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.topSkills} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" stroke="var(--text-secondary)" />
                  <YAxis dataKey="_id" type="category" stroke="var(--text-secondary)" width={100} />
                  <RechartsTooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-primary)', borderRadius: '8px' }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {analytics.topSkills.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      <div className="card mb-lg">
        <h3 className="mb-md">Search Talent</h3>
        <form onSubmit={handleSearch} className="grid grid-4 items-center">
          <div className="input-group">
            <label>Skill</label>
            <input className="input" placeholder="e.g. React" value={filters.skill} onChange={e => setFilters({...filters, skill: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Min Level</label>
            <input className="input" type="number" placeholder="1" value={filters.minLevel} onChange={e => setFilters({...filters, minLevel: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Location</label>
            <input className="input" placeholder="e.g. Remote" value={filters.location} onChange={e => setFilters({...filters, location: e.target.value})} />
          </div>
          <div className="input-group" style={{ alignSelf: 'flex-end' }}>
            <button type="submit" className="btn btn-primary w-full">Search Candidates</button>
          </div>
        </form>
      </div>

      <div className="grid grid-3">
        {candidates.map((candidate, i) => (
          <motion.div key={candidate._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card card-glass">
            <div className="flex items-center gap-md mb-sm">
              <div className="level-badge" style={{ width: 48, height: 48, fontSize: '1.2rem' }}>{candidate.level}</div>
              <div>
                <h4 className="font-bold">{candidate.username}</h4>
                <p className="text-sm text-muted">{candidate.location || 'Location not specified'}</p>
              </div>
            </div>
            <p className="text-sm text-muted mb-md" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {candidate.bio || 'No bio provided.'}
            </p>
            <div className="flex flex-wrap gap-xs mb-md">
              {candidate.topSkills?.slice(0, 3).map((skill, idx) => (
                <span key={idx} className="badge badge-info">{skill.name}</span>
              ))}
            </div>
            <div className="flex justify-between items-center border-t border-primary pt-sm mt-sm">
              <span className="text-xs font-bold text-gradient">{formatNumber(candidate.xp)} XP</span>
              <a href={`/profile/${candidate._id}`} className="btn btn-sm btn-ghost">View Profile</a>
            </div>
          </motion.div>
        ))}
        {candidates.length === 0 && !loading && (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-icon">🔍</div>
            <h3>No candidates found</h3>
            <p>Try adjusting your search filters to find more developers.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
