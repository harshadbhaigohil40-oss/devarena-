import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { leaderboardService } from '../services';
import { useAuth } from '../context/AuthContext';
import { formatNumber } from '../utils/helpers';

export default function Leaderboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [period, setPeriod] = useState('all');
  const [limit, setLimit] = useState(50);
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState(null);

  useEffect(() => {
    setLoading(true);
    leaderboardService.get({ period, limit })
      .then(r => setEntries(r.data.data.entries))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [period, limit]);

  useEffect(() => {
    if (user?._id) {
      leaderboardService.getRank(user._id).then(r => setMyRank(r.data.data.entry)).catch(() => {});
    }
  }, [user]);

  const rankColors = { 1: '🥇', 2: '🥈', 3: '🥉' };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
      <div className="page-header">
        <h1>Leaderboard</h1>
        <p>Top developers ranked by Points (XP) and achievements</p>
      </div>

      {/* My Rank */}
      {myRank && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="card mb-lg" style={{ background: 'linear-gradient(135deg, rgba(108,92,231,0.1), rgba(0,206,201,0.05))', borderColor: 'rgba(108,92,231,0.2)' }}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-md">
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-primary)' }}>#{myRank.rank || '—'}</span>
              <div>
                <p className="font-bold">Your Rank</p>
                <p className="text-sm text-muted">{formatNumber(myRank.totalXp)} Points · Level {myRank.level}</p>
              </div>
            </div>
            <div className="level-badge level-badge-lg">{myRank.level}</div>
          </div>
        </motion.div>
      )}

      {/* Filters and Options */}
      <div className="flex justify-between items-center mb-md" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div className="tabs" style={{ marginBottom: 0 }}>
          {['all', 'weekly', 'monthly'].map(p => (
            <button key={p} className={`tab ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)} style={{ textTransform: 'capitalize' }}>
              {p === 'all' ? 'All Time' : p}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-sm">
          <label className="text-sm text-muted font-semibold">Show:</label>
          <select 
            className="input" 
            style={{ padding: '0.35rem 0.75rem', width: 'auto', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'var(--bg-secondary)' }} 
            value={limit} 
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value={10}>Top 10</option>
            <option value={25}>Top 25</option>
            <option value={50}>Top 50</option>
            <option value={100}>Top 100</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div>{[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: 60, marginBottom: 8 }} />)}</div>
      ) : entries.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">🏆</div><h3>No entries yet</h3><p>Complete challenges to appear on the leaderboard!</p></div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {entries.map((entry, i) => (
            <motion.div key={entry._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
              onClick={() => navigate(`/profile/${entry.userId}`)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem',
                borderBottom: i < entries.length - 1 ? '1px solid var(--border-primary)' : 'none',
                background: user?._id === entry.userId ? 'rgba(108,92,231,0.05)' : 'transparent',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
              onMouseOver={(e) => { if (user?._id !== entry.userId) e.currentTarget.style.background = 'var(--bg-hover)'; }}
              onMouseOut={(e) => { if (user?._id !== entry.userId) e.currentTarget.style.background = 'transparent'; }}
            >
              <div className="flex items-center gap-md">
                <span style={{ width: 30, textAlign: 'center', fontWeight: 800, fontSize: i < 3 ? '1.25rem' : '0.9rem', color: i < 3 ? 'var(--xp-gold)' : 'var(--text-tertiary)' }}>
                  {rankColors[i + 1] || `#${i + 1}`}
                </span>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', background: 'var(--level-gradient)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', color: 'white',
                }}>
                  {entry.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm">{entry.username}</p>
                  <p className="text-xs text-muted">Level {entry.level} · {entry.challengesSolved || 0} solved</p>
                </div>
              </div>
              <div className="flex items-center gap-md">
                {entry.currentStreak > 0 && <span className="text-sm" style={{ color: 'var(--color-warning)' }}>🔥 {entry.currentStreak}d</span>}
                <span style={{ color: 'var(--xp-gold)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{formatNumber(entry.totalXp)} Pts</span>
                <div className="level-badge" style={{ width: 28, height: 28, fontSize: '0.7rem' }}>{entry.level}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
