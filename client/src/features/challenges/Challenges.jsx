import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { challengeService } from '../../services';
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
