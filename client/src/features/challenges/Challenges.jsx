import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { challengeService, userService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { formatNumber, progressToNextLevel } from '../../utils/helpers';
import toast from 'react-hot-toast';
import ChallengeCard from './components/ChallengeCard';

// Custom hook for debouncing search input with instant update capability
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return [debouncedValue, setDebouncedValue];
}

export default function Challenges() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = searchParams.get('difficulty') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const nodeId = searchParams.get('node') || '';

  const [filter, setFilter] = useState(initialFilter);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useDebounce(searchInput, 300); // 300ms responsive debounce
  const [page, setPage] = useState(1);

  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ['userStats', user?._id],
    queryFn: async () => {
      const res = await userService.getStats(user._id);
      return res.data?.data || null;
    },
    enabled: !!user?._id,
  });

  const currentLevel = user?.level || 1;
  const currentXp = stats?.xp ?? user?.xp ?? 0;
  const currentStreak = stats?.streak ?? user?.streak ?? 0;
  const progress = progressToNextLevel(currentXp);

  const statCards = [
    { icon: '⚔️', value: stats?.challengesSolved ?? 0, label: 'Challenges Solved', color: 'var(--color-success)' },
    { icon: '📝', value: stats?.totalSubmissions ?? 0, label: 'Total Submissions', color: 'var(--color-info)' },
    { icon: '🏅', value: stats?.recentBadges?.length ?? 0, label: 'Badges Earned', color: 'var(--xp-gold)' },
    { icon: '🚀', value: user?.projectCount ?? 0, label: 'Projects Built', color: 'var(--accent-secondary)' },
  ];

  // Update URL params only when filter, search, or node genuinely changes
  useEffect(() => {
    const currentDifficulty = searchParams.get('difficulty') || 'all';
    const currentSearch = searchParams.get('search') || '';
    const currentNode = searchParams.get('node') || '';

    if (filter !== currentDifficulty || debouncedSearch !== currentSearch || (nodeId || '') !== currentNode) {
      const params = {};
      if (filter !== 'all') params.difficulty = filter;
      if (debouncedSearch) params.search = debouncedSearch;
      if (nodeId) params.node = nodeId;
      setSearchParams(params, { replace: true });
      setPage(1);
    }
  }, [filter, debouncedSearch, nodeId, searchParams, setSearchParams]);

  const { data: result = { challenges: [], total: 0 }, isLoading: loading } = useQuery({
    queryKey: ['challenges', filter, debouncedSearch, page, nodeId],
    queryFn: async () => {
      const params = { page, limit: 18 };
      if (filter !== 'all') params.difficulty = filter;
      if (debouncedSearch) params.search = debouncedSearch;
      if (nodeId) params.node = nodeId;
      
      const res = await challengeService.list(params);
      const responseData = res.data;
      
      if (responseData.pagination) {
        return { challenges: responseData.data, total: responseData.pagination.total };
      }
      
      const fetchedData = responseData.data;
      if (Array.isArray(fetchedData)) return { challenges: fetchedData, total: fetchedData.length };
      return { challenges: fetchedData.challenges || fetchedData, total: fetchedData.total || 0 };
    },
    onError: () => toast.error('Failed to load challenges'),
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
      {/* Premium Header */}
      <div className="flex justify-between items-end mb-xl challenges-header">
        <div>
          <h1 className="mb-sm flex items-center gap-sm challenges-header-title">
            <motion.span 
              initial={{ rotate: -20, scale: 0.8 }} 
              animate={{ rotate: 0, scale: 1 }} 
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="challenges-header-icon"
            >
              ⚔️
            </motion.span> 
            <span className="challenges-header-text">
              Coding Challenges
            </span>
          </h1>
          <p className="text-muted challenges-header-desc">Solve problems, earn XP, and climb the leaderboard.</p>
        </div>
        
        {/* Animated Filter Tabs */}
        <div className="flex gap-sm filter-tabs-container">
          {['all', 'beginner', 'intermediate', 'advanced'].map(level => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`filter-tab-btn ${filter === level ? 'active' : 'inactive'}`}
            >
              {filter === level && (
                <motion.div
                  layoutId="activeFilter"
                  className="filter-active-bg"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Premium Progress Overview & XP Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        className="card mb-xl" 
        style={{
          background: 'linear-gradient(135deg, rgba(108,92,231,0.15) 0%, rgba(0,206,201,0.05) 100%)',
          border: '1px solid rgba(108,92,231,0.3)',
          boxShadow: 'var(--shadow-md), inset 0 0 0 1px var(--border-primary)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'var(--accent-primary)', filter: 'blur(100px)', opacity: 0.2, zIndex: 0 }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
            <div className="flex items-center gap-lg">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="level-badge" 
                style={{ width: 'clamp(56px, 12vw, 80px)', height: 'clamp(56px, 12vw, 80px)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', boxShadow: '0 0 30px rgba(108,92,231,0.4), inset 0 0 15px rgba(255,255,255,0.3)', flexShrink: 0 }}
              >
                {currentLevel}
              </motion.div>
              <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Level {currentLevel}</h3>
                <p className="text-muted" style={{ fontSize: '1rem' }}>
                  <span style={{ color: 'var(--xp-gold)', fontWeight: 700 }}>{formatNumber(currentXp)}</span> XP total
                </p>
              </div>
            </div>
            <div className="flex items-center gap-md" style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)' }}>
              <motion.span animate={{ scale: [1, 1.2, 1], filter: ['drop-shadow(0 0 0px #ff9f43)', 'drop-shadow(0 0 15px #ff9f43)', 'drop-shadow(0 0 0px #ff9f43)'] }} transition={{ repeat: Infinity, duration: 2 }} style={{ fontSize: '2rem' }}>🔥</motion.span>
              <div>
                <p style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--color-warning)', lineHeight: 1 }}>{currentStreak}</p>
                <p className="text-xs text-muted" style={{ textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>Day Streak</p>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '1.5rem' }}>
            <div className="flex justify-between mb-sm">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Progress to Level {currentLevel + 1}</span>
              <span className="text-sm font-bold" style={{ color: 'var(--accent-secondary)', textShadow: '0 0 10px var(--accent-secondary)' }}>{Math.round(progress)}%</span>
            </div>
            <div className="xp-bar-container" style={{ height: 16, background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}>
              <motion.div 
                className="xp-bar-fill" 
                initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1.5, type: "spring" }} 
                style={{ background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))', boxShadow: '0 0 15px var(--accent-primary), inset 0 0 10px rgba(255,255,255,0.5)' }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Core Progress Stats Grid */}
      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        {statCards.map((s, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.15 + i * 0.05 }} 
            whileHover={{ y: -5, scale: 1.02, boxShadow: `0 15px 30px rgba(0,0,0,0.3), inset 0 0 0 1px ${s.color}40` }}
            className="stat-card"
            style={{ position: 'relative', overflow: 'hidden', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}
          >
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', fontSize: '4rem', opacity: 0.05, filter: 'grayscale(100%)' }}>{s.icon}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '1.5rem', background: `${s.color}20`, padding: '0.5rem', borderRadius: '12px', display: 'flex' }}>{s.icon}</div>
              <div className="stat-value" style={{ fontSize: '2rem', color: 'var(--text-primary)', textShadow: `0 2px 10px ${s.color}40`, fontWeight: 700 }}>{s.value}</div>
            </div>
            <div className="stat-label" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <input 
          type="text" 
          className="search-input" 
          value={searchInput} 
          onChange={e => setSearchInput(e.target.value)} 
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              setDebouncedSearch(searchInput);
            }
          }}
          placeholder="Search challenges by name, topic, or pattern..." 
        />
        <span className="search-icon">🔍</span>
        {searchInput && (
          <button 
            onClick={() => {
              setSearchInput('');
              setDebouncedSearch('');
            }} 
            className="search-clear-btn"
          >
            ✕
          </button>
        )}
      </div>

      {/* Active search indicator */}
      {debouncedSearch && (
        <div className="search-active-indicator" style={{ flexWrap: 'wrap', gap: '0.35rem' }}>
          <span>Showing results for</span>
          <span className="search-active-term" style={{ wordBreak: 'break-all' }}>"{debouncedSearch}"</span>
          <span className="text-tertiary">({result.total} found)</span>
        </div>
      )}

      {/* Active node indicator */}
      {nodeId && (
        <div className="search-active-indicator" style={{ flexWrap: 'wrap', gap: '0.35rem', marginTop: debouncedSearch ? '0.25rem' : '0' }}>
          <span>Filtered by node:</span>
          <span className="search-active-term" style={{ textTransform: 'capitalize' }}>{nodeId}</span>
          <button 
            onClick={() => {
              const newParams = new URLSearchParams(searchParams);
              newParams.delete('node');
              setSearchParams(newParams);
            }} 
            style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', marginLeft: '0.5rem', fontWeight: 600, fontSize: '0.85rem' }}
          >
            Clear filter ✕
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-3 gap-lg">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: i * 0.1 }} 
              className="card skeleton skeleton-card" 
            />
          ))}
        </div>
      ) : result.challenges.length === 0 ? (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card text-center empty-state-card">
          <span className="empty-state-icon">🔍</span>
          <h3>No Challenges Found</h3>
          <p className="text-muted">We couldn't find any challenges matching your criteria. Check back soon!</p>
        </motion.div>
      ) : (
        <>
          <motion.div layout className="grid grid-3 gap-lg">
            <AnimatePresence>
              {result.challenges.map((challenge, index) => (
                <ChallengeCard key={challenge._id} challenge={challenge} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination */}
          {result.total > 18 && (
            <div className="pagination-container">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))} 
                disabled={page === 1}
                className={`pagination-btn ${page === 1 ? 'disabled' : 'enabled'}`}
              >
                ← Previous
              </button>
              <span className="pagination-text">
                Page {page} of {Math.ceil(result.total / 18)}
              </span>
              <button 
                onClick={() => setPage(p => p + 1)} 
                disabled={page >= Math.ceil(result.total / 18)}
                className={`pagination-btn ${page >= Math.ceil(result.total / 18) ? 'disabled' : 'enabled primary'}`}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
