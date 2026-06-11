import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { challengeService } from '../../services';
import toast from 'react-hot-toast';

export default function Challenges() {
  const [filter, setFilter] = useState('all');

  const { data: challenges = [], isLoading: loading, isError } = useQuery({
    queryKey: ['challenges', filter],
    queryFn: async () => {
      const params = filter !== 'all' ? { difficulty: filter } : {};
      const res = await challengeService.list(params);
      const fetchedData = res.data.data;
      return Array.isArray(fetchedData) ? fetchedData : fetchedData.challenges || [];
    },
    onError: () => toast.error('Failed to load challenges'),
  });

  const difficultyColors = {
    beginner: 'var(--color-success)',
    intermediate: 'var(--color-warning)',
    advanced: 'var(--color-danger)'
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
      {/* Premium Header */}
      <div className="flex justify-between items-end mb-xl" style={{ flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: 10 }}>
        <div>
          <h1 className="mb-sm flex items-center gap-sm" style={{ fontSize: '2.5rem' }}>
            <motion.span 
              initial={{ rotate: -20, scale: 0.8 }} 
              animate={{ rotate: 0, scale: 1 }} 
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              style={{ display: 'inline-block', filter: 'drop-shadow(0 0 10px rgba(108,92,231,0.5))' }}
            >
              ⚔️
            </motion.span> 
            <span style={{ background: 'linear-gradient(135deg, var(--text-primary), var(--accent-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Coding Challenges
            </span>
          </h1>
          <p className="text-muted" style={{ fontSize: '1.1rem' }}>Solve problems, earn XP, and climb the leaderboard.</p>
        </div>
        
        {/* Animated Filter Tabs */}
        <div className="flex gap-sm p-xs" style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', padding: '0.25rem' }}>
          {['all', 'beginner', 'intermediate', 'advanced'].map(level => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              style={{ 
                position: 'relative',
                padding: '0.5rem 1.25rem',
                border: 'none',
                background: 'transparent',
                color: filter === level ? '#fff' : 'var(--text-muted)',
                fontWeight: 600,
                textTransform: 'capitalize',
                cursor: 'pointer',
                borderRadius: 'var(--radius-md)',
                transition: 'color 0.3s ease',
                zIndex: 1
              }}
            >
              {filter === level && (
                <motion.div
                  layoutId="activeFilter"
                  style={{ position: 'absolute', inset: 0, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', zIndex: -1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {level}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-3" style={{ gap: '1.5rem' }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className="card skeleton" style={{ height: '220px', borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      ) : challenges.length === 0 ? (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card text-center" style={{ padding: '4rem 2rem', borderStyle: 'dashed' }}>
          <span style={{ fontSize: '4rem', marginBottom: '1rem', display: 'block', filter: 'grayscale(100%) opacity(50%)' }}>🔍</span>
          <h3>No Challenges Found</h3>
          <p className="text-muted">We couldn't find any challenges matching your criteria. Check back soon!</p>
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-3" style={{ gap: '1.5rem' }}>
          <AnimatePresence>
            {challenges.map((challenge, index) => (
              <motion.div 
                key={challenge._id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to={`/challenges/${challenge.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="card" style={{ 
                    height: '100%', display: 'flex', flexDirection: 'column',
                    background: 'var(--bg-secondary)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}>
                    {/* Hover Glow Background */}
                    <div className="hover-glow-bg" style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: `radial-gradient(circle, ${difficultyColors[challenge.difficulty]}15 0%, transparent 50%)`, opacity: 0, transition: 'opacity 0.3s ease', zIndex: 0, pointerEvents: 'none' }} />
                    
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <div className="flex justify-between items-start mb-md">
                        <span 
                          style={{ 
                            textTransform: 'capitalize', 
                            background: `${difficultyColors[challenge.difficulty]}15`,
                            border: `1px solid ${difficultyColors[challenge.difficulty]}40`,
                            color: difficultyColors[challenge.difficulty],
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            letterSpacing: '0.5px',
                            boxShadow: `0 0 10px ${difficultyColors[challenge.difficulty]}20`
                          }}
                        >
                          {challenge.difficulty}
                        </span>
                        <div style={{ background: 'var(--bg-tertiary)', padding: '0.25rem 0.5rem', borderRadius: '8px', border: '1px solid var(--border-primary)' }}>
                          <span style={{ color: 'var(--xp-gold)', fontWeight: 800, fontSize: '0.85rem' }}>
                            ⚡ {challenge.xpReward} XP
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="mb-sm" style={{ fontSize: '1.25rem', lineHeight: 1.3 }}>{challenge.title}</h3>
                      
                      <div className="flex gap-xs mb-lg" style={{ flexWrap: 'wrap' }}>
                        <span className="badge badge-primary text-xs" style={{ textTransform: 'capitalize', boxShadow: '0 0 10px rgba(108,92,231,0.2)' }}>
                          {challenge.category}
                        </span>
                        {challenge.tags?.slice(0, 2).map(tag => (
                          <span key={tag} className="badge text-xs" style={{ background: 'var(--bg-tertiary)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            {tag}
                          </span>
                        ))}
                        {challenge.tags?.length > 2 && (
                          <span className="badge text-xs" style={{ background: 'var(--bg-tertiary)' }}>
                            +{challenge.tags.length - 2}
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-auto pt-md" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        <span className="flex items-center gap-xs"><span style={{ opacity: 0.5 }}>👥</span> {challenge.attemptCount || 0} attempts</span>
                        <span className="flex items-center gap-xs"><span style={{ opacity: 0.5 }}>✅</span> {challenge.completionCount || 0} solved</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}
