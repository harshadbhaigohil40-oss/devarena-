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
      <header style={{ textAlign: 'center', marginBottom: '3rem', paddingTop: '1rem' }}>
        <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem', color: '#fff' }}>
          Global Leaderboard
        </motion.h1>
        <motion.p initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} style={{ fontSize: '1.125rem', color: 'var(--text-secondary)' }}>
          The top performing architects of the DevArena ecosystem.
        </motion.p>
      </header>

      {/* Filters and Options */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '100px', padding: '0.25rem' }}>
          {['all', 'weekly', 'monthly'].map(p => (
            <button key={p} 
              className={`tab ${period === p ? 'active' : ''}`} 
              onClick={() => setPeriod(p)} 
              style={{ textTransform: 'capitalize', margin: 0, padding: '0.5rem 1.5rem', borderRadius: '100px', background: period === p ? 'rgba(255,255,255,0.1)' : 'transparent', color: period === p ? '#fff' : 'var(--text-secondary)', border: 'none', fontWeight: 600, transition: 'all 0.2s' }}>
              {p === 'all' ? 'All Time' : p}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', height: '300px', alignItems: 'flex-end' }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ width: 200, height: i === 2 ? 250 : 200, borderRadius: 16 }} />)}
        </div>
      ) : entries.length === 0 ? (
        <div className="empty-state"><h3>No entries yet</h3><p>Complete challenges to appear on the leaderboard!</p></div>
      ) : (
        <>
          {/* Podium Section */}
          {top3.length > 0 && (
            <section style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: '1.5rem', marginBottom: '4rem', marginTop: '3rem', flexWrap: 'wrap' }}>
              
              {/* Rank 2: Silver */}
              {top3[1] && (
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '260px', order: window.innerWidth < 768 ? 2 : 1, cursor: 'pointer' }}
                  onClick={() => navigate(`/profile/${top3[1].userId}`)}
                >
                  <div style={{ position: 'relative', marginBottom: '1rem' }}>
                    <div style={{ width: '96px', height: '96px', borderRadius: '50%', padding: '4px', background: 'var(--bg-primary)', boxShadow: '0 0 20px rgba(149, 142, 160, 0.2)', border: '2px solid #958ea0', overflow: 'hidden' }}>
                      <img src={getAvatar(top3[1].username)} alt="Rank 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ position: 'absolute', bottom: '-8px', right: '-8px', width: '32px', height: '32px', background: '#958ea0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-primary)', fontWeight: 800, color: '#fff' }}>2</div>
                  </div>
                  <div style={{ textAlign: 'center', width: '100%', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(16px)', border: '1px solid rgba(149, 142, 160, 0.2)', borderRadius: '16px', transition: 'transform 0.2s', ':hover': { transform: 'translateY(-5px)' } }}>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>{top3[1].username}</p>
                    <p style={{ fontSize: '0.875rem', color: '#958ea0', fontWeight: 600, marginBottom: '0.5rem' }}>LVL {top3[1].level}</p>
                    <div style={{ paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ color: 'var(--accent-primary)', fontWeight: 800, fontSize: '1.25rem' }}>{formatNumber(top3[1].totalXp)}</span>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>TOTAL XP</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Rank 1: Gold */}
              {top3[0] && (
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: -30, opacity: 1 }} transition={{ delay: 0.1 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '280px', order: window.innerWidth < 768 ? 1 : 2, transform: 'translateY(-30px)', zIndex: 10, cursor: 'pointer' }}
                  onClick={() => navigate(`/profile/${top3[0].userId}`)}
                >
                  <div style={{ position: 'relative', marginBottom: '1rem' }}>
                    <div style={{ position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)', color: '#ca801e', animation: 'bounce 2s infinite' }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15.25L16.25 17.75L15.1 12.9L19 9.55L14.05 9.1L12 4.5L9.95 9.1L5 9.55L8.9 12.9L7.75 17.75L12 15.25Z"/></svg>
                    </div>
                    <div style={{ width: '128px', height: '128px', borderRadius: '50%', padding: '4px', background: 'var(--bg-primary)', boxShadow: '0 0 30px rgba(202, 128, 30, 0.4)', border: '2px solid #ca801e', overflow: 'hidden' }}>
                      <img src={getAvatar(top3[0].username)} alt="Rank 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ position: 'absolute', bottom: '-8px', right: '-8px', width: '40px', height: '40px', background: '#ca801e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-primary)', fontWeight: 900, color: '#fff', fontSize: '1.2rem' }}>1</div>
                  </div>
                  <div style={{ textAlign: 'center', width: '100%', padding: '2rem 1.5rem', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(16px)', border: '1px solid rgba(202, 128, 30, 0.3)', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{top3[0].username}</p>
                    <p style={{ fontSize: '0.875rem', color: '#ca801e', fontWeight: 700, marginBottom: '0.75rem' }}>LVL {top3[0].level} Master</p>
                    <div style={{ paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                      <span style={{ color: '#ca801e', fontWeight: 900, fontSize: '1.75rem' }}>{formatNumber(top3[0].totalXp)}</span>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>TOTAL XP</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Rank 3: Bronze */}
              {top3[2] && (
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '260px', order: 3, cursor: 'pointer' }}
                  onClick={() => navigate(`/profile/${top3[2].userId}`)}
                >
                  <div style={{ position: 'relative', marginBottom: '1rem' }}>
                    <div style={{ width: '96px', height: '96px', borderRadius: '50%', padding: '4px', background: 'var(--bg-primary)', boxShadow: '0 0 15px rgba(176, 114, 53, 0.2)', border: '2px solid #b07235', overflow: 'hidden' }}>
                      <img src={getAvatar(top3[2].username)} alt="Rank 3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ position: 'absolute', bottom: '-8px', right: '-8px', width: '32px', height: '32px', background: '#b07235', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-primary)', fontWeight: 800, color: '#fff' }}>3</div>
                  </div>
                  <div style={{ textAlign: 'center', width: '100%', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(16px)', border: '1px solid rgba(176, 114, 53, 0.2)', borderRadius: '16px' }}>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>{top3[2].username}</p>
                    <p style={{ fontSize: '0.875rem', color: '#b07235', fontWeight: 600, marginBottom: '0.5rem' }}>LVL {top3[2].level}</p>
                    <div style={{ paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ color: 'var(--accent-primary)', fontWeight: 800, fontSize: '1.25rem' }}>{formatNumber(top3[2].totalXp)}</span>
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
              style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rank</th>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User</th>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Level</th>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Total XP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rest.map((entry, index) => {
                      const rank = index + 4;
                      const isMe = user?._id === entry.userId;
                      return (
                        <tr key={entry._id} 
                          style={{ 
                            background: isMe ? 'rgba(138, 43, 226, 0.1)' : (index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'),
                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = isMe ? 'rgba(138, 43, 226, 0.1)' : (index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'); e.currentTarget.style.transform = 'translateX(0)'; }}
                          onClick={() => navigate(`/profile/${entry.userId}`)}
                        >
                          <td style={{ padding: '1rem 1.5rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{rank}</td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <img src={getAvatar(entry.username)} alt={entry.username} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', background: 'var(--bg-secondary)' }} />
                              <span style={{ fontWeight: 600, color: '#fff' }}>{entry.username} {isMe && '(You)'}</span>
                            </div>
                          </td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '100px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600 }}>LVL {entry.level}</span>
                          </td>
                          <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontWeight: 700 }}>
                            {formatNumber(entry.totalXp)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', fontWeight: 600 }}>Showing Top {entries.length}</span>
                {entries.length === limit && (
                  <button 
                    onClick={() => setLimit(l => l + 50)}
                    style={{ padding: '0.5rem 1.5rem', background: 'var(--accent-primary)', color: '#fff', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
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
