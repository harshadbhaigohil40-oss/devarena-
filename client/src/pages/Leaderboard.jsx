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

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  // Helper for dynamic avatars
  const getAvatar = (username) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf,ffd5dc`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header Section */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem', paddingTop: '1rem' }}>
        <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem', color: 'var(--text-heading, var(--text-primary))' }}>
          Global Leaderboard
        </motion.h1>
        <motion.p initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.125rem)', color: 'var(--text-secondary)' }}>
          The top performing architects of the DevArena ecosystem.
        </motion.p>
      </header>

      {/* Filters and Options */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '100px', padding: '0.25rem', overflowX: 'auto', maxWidth: '100%' }}>
          {['all', 'weekly', 'monthly'].map(p => (
            <button key={p} 
              className={`tab ${period === p ? 'active' : ''}`} 
              onClick={() => setPeriod(p)} 
              style={{ 
                textTransform: 'capitalize', 
                margin: 0, 
                padding: '0.45rem clamp(0.75rem, 2.5vw, 1.25rem)', 
                fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
                borderRadius: '100px', 
                background: period === p ? 'var(--accent-primary)' : 'transparent', 
                color: period === p ? '#ffffff' : 'var(--text-secondary)', 
                border: 'none', 
                fontWeight: 600, 
                transition: 'all 0.2s', 
                whiteSpace: 'nowrap' 
              }}>
              {p === 'all' ? 'All Time' : p}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', minHeight: '300px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ width: 'min(200px, 80%)', height: i === 2 ? 250 : 200, borderRadius: 16 }} />)}
        </div>
      ) : entries.length === 0 ? (
        <div className="empty-state"><h3>No entries yet</h3><p>Complete challenges to appear on the leaderboard!</p></div>
      ) : (
        <>
          {/* Podium Section */}
          {top3.length > 0 && (
            <section className="leaderboard-podium">
              
              {/* Rank 2: Silver */}
              {top3[1] && (
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                  className="leaderboard-podium-card leaderboard-podium-silver"
                  onClick={() => navigate(`/profile/${top3[1].userId}`)}
                >
                  <div style={{ position: 'relative', marginBottom: '1rem' }}>
                    <div style={{ width: 'clamp(80px, 15vw, 96px)', height: 'clamp(80px, 15vw, 96px)', borderRadius: '50%', padding: '4px', background: 'var(--bg-primary)', boxShadow: '0 0 20px rgba(149, 142, 160, 0.2)', border: '2px solid #958ea0', overflow: 'hidden' }}>
                      <img src={getAvatar(top3[1].username)} alt="Rank 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ position: 'absolute', bottom: '-6px', right: '-6px', width: '30px', height: '30px', background: '#958ea0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-primary)', fontWeight: 800, color: '#fff', fontSize: '0.9rem' }}>2</div>
                  </div>
                  <div className="leaderboard-podium-inner" style={{ textAlign: 'center', width: '100%', padding: '1.5rem 1rem', background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)', border: '1px solid rgba(149, 142, 160, 0.3)', borderRadius: '16px', transition: 'transform 0.2s' }}>
                    <p style={{ fontSize: 'clamp(1.05rem, 3vw, 1.25rem)', fontWeight: 700, color: 'var(--text-primary)', wordBreak: 'break-word' }}>{top3[1].username}</p>
                    <p style={{ fontSize: '0.875rem', color: '#958ea0', fontWeight: 600, marginBottom: '0.5rem' }}>LVL {top3[1].level}</p>
                    <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-primary)' }}>
                      <span style={{ color: 'var(--accent-primary)', fontWeight: 800, fontSize: 'clamp(1.1rem, 3vw, 1.25rem)' }}>{formatNumber(top3[1].totalXp)}</span>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>TOTAL XP</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Rank 1: Gold */}
              {top3[0] && (
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                  className="leaderboard-podium-card leaderboard-podium-gold"
                  style={{ zIndex: 10 }}
                  onClick={() => navigate(`/profile/${top3[0].userId}`)}
                >
                  <div style={{ position: 'relative', marginBottom: '1rem' }}>
                    <div style={{ position: 'absolute', top: '-36px', left: '50%', transform: 'translateX(-50%)', color: '#ca801e', animation: 'bounce 2s infinite' }}>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15.25L16.25 17.75L15.1 12.9L19 9.55L14.05 9.1L12 4.5L9.95 9.1L5 9.55L8.9 12.9L7.75 17.75L12 15.25Z"/></svg>
                    </div>
                    <div style={{ width: 'clamp(96px, 18vw, 128px)', height: 'clamp(96px, 18vw, 128px)', borderRadius: '50%', padding: '4px', background: 'var(--bg-primary)', boxShadow: '0 0 30px rgba(202, 128, 30, 0.4)', border: '2px solid #ca801e', overflow: 'hidden' }}>
                      <img src={getAvatar(top3[0].username)} alt="Rank 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ position: 'absolute', bottom: '-6px', right: '-6px', width: '36px', height: '36px', background: '#ca801e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-primary)', fontWeight: 900, color: '#fff', fontSize: '1.1rem' }}>1</div>
                  </div>
                  <div className="leaderboard-podium-inner" style={{ textAlign: 'center', width: '100%', padding: '1.75rem 1.25rem', background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)', border: '1px solid rgba(202, 128, 30, 0.4)', borderRadius: '24px', boxShadow: 'var(--shadow-lg)' }}>
                    <p style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)', fontWeight: 800, color: 'var(--text-primary)', wordBreak: 'break-word' }}>{top3[0].username}</p>
                    <p style={{ fontSize: '0.875rem', color: '#ca801e', fontWeight: 700, marginBottom: '0.75rem' }}>LVL {top3[0].level} Master</p>
                    <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-primary)' }}>
                      <span style={{ color: '#ca801e', fontWeight: 900, fontSize: 'clamp(1.35rem, 4vw, 1.75rem)' }}>{formatNumber(top3[0].totalXp)}</span>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>TOTAL XP</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Rank 3: Bronze */}
              {top3[2] && (
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                  className="leaderboard-podium-card leaderboard-podium-bronze"
                  onClick={() => navigate(`/profile/${top3[2].userId}`)}
                >
                  <div style={{ position: 'relative', marginBottom: '1rem' }}>
                    <div style={{ width: 'clamp(80px, 15vw, 96px)', height: 'clamp(80px, 15vw, 96px)', borderRadius: '50%', padding: '4px', background: 'var(--bg-primary)', boxShadow: '0 0 15px rgba(176, 114, 53, 0.2)', border: '2px solid #b07235', overflow: 'hidden' }}>
                      <img src={getAvatar(top3[2].username)} alt="Rank 3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ position: 'absolute', bottom: '-6px', right: '-6px', width: '30px', height: '30px', background: '#b07235', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-primary)', fontWeight: 800, color: '#fff', fontSize: '0.9rem' }}>3</div>
                  </div>
                  <div className="leaderboard-podium-inner" style={{ textAlign: 'center', width: '100%', padding: '1.5rem 1rem', background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)', border: '1px solid rgba(176, 114, 53, 0.3)', borderRadius: '16px' }}>
                    <p style={{ fontSize: 'clamp(1.05rem, 3vw, 1.25rem)', fontWeight: 700, color: 'var(--text-primary)', wordBreak: 'break-word' }}>{top3[2].username}</p>
                    <p style={{ fontSize: '0.875rem', color: '#b07235', fontWeight: 600, marginBottom: '0.5rem' }}>LVL {top3[2].level}</p>
                    <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-primary)' }}>
                      <span style={{ color: 'var(--accent-primary)', fontWeight: 800, fontSize: 'clamp(1.1rem, 3vw, 1.25rem)' }}>{formatNumber(top3[2].totalXp)}</span>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>TOTAL XP</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </section>
          )}

          {/* Data Table Section */}
          {rest.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} 
              style={{ background: 'var(--bg-secondary)', backdropFilter: 'blur(16px)', border: '1px solid var(--border-primary)', borderRadius: '16px', overflow: 'hidden' }}>
              <div className="leaderboard-table-container">
                <table className="leaderboard-table">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-tertiary)' }}>
                      <th className="leaderboard-th" style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rank</th>
                      <th className="leaderboard-th" style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User</th>
                      <th className="leaderboard-th" style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Level</th>
                      <th className="leaderboard-th" style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Total XP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rest.map((entry, index) => {
                      const rank = index + 4;
                      const isMe = user?._id === entry.userId;
                      return (
                        <tr key={entry._id} 
                          style={{ 
                            background: isMe ? 'var(--accent-primary-glow)' : 'transparent',
                            borderBottom: '1px solid var(--border-primary)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = isMe ? 'var(--accent-primary-glow)' : 'transparent'; e.currentTarget.style.transform = 'translateX(0)'; }}
                          onClick={() => navigate(`/profile/${entry.userId}`)}
                        >
                          <td className="leaderboard-td" style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>{rank}</td>
                          <td className="leaderboard-td">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                              <img src={getAvatar(entry.username)} alt={entry.username} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', flexShrink: 0 }} />
                              <span style={{ fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-word' }}>{entry.username} {isMe && '(You)'}</span>
                            </div>
                          </td>
                          <td className="leaderboard-td">
                            <span style={{ padding: '0.2rem 0.6rem', borderRadius: '100px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>LVL {entry.level}</span>
                          </td>
                          <td className="leaderboard-td" style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                            {formatNumber(entry.totalXp)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary)', flexWrap: 'wrap', gap: '0.75rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Showing Top {entries.length}</span>
                {entries.length === limit && (
                  <button 
                    onClick={() => setLimit(l => l + 50)}
                    className="btn btn-primary btn-sm"
                    style={{ minHeight: 38 }}
                  >
                    Load More
                  </button>
                )}
              </div>
            </motion.section>
          )}
        </>
      )}
    </motion.div>
  );
}
