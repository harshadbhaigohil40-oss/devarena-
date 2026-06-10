import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';

// Mock search function (in reality this would hit an API)
const mockSearch = (query: string) => {
  const allItems = [
    { id: 1, type: 'challenge', title: 'Two Sum', url: '/challenges/two-sum' },
    { id: 2, type: 'challenge', title: 'Reverse Linked List', url: '/challenges/reverse-linked-list' },
    { id: 3, type: 'user', title: 'alex_dev', url: '/profile/alex' },
    { id: 4, type: 'user', title: 'sarah_hacker', url: '/profile/sarah' },
    { id: 5, type: 'page', title: 'Dashboard', url: '/dashboard' },
    { id: 6, type: 'page', title: 'Settings', url: '/settings' },
  ];
  return allItems.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
};

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Handle Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle focus when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Execute search when debounced query changes
  useEffect(() => {
    if (debouncedQuery) {
      setResults(mockSearch(debouncedQuery));
    } else {
      setResults([]);
    }
    setSelectedIndex(0);
  }, [debouncedQuery]);

  // Handle Keyboard Navigation within palette
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }
    if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex].url);
    }
  };

  const handleSelect = (url: string) => {
    setIsOpen(false);
    navigate(url);
  };

  return (
    <>
      {/* Global trigger button logic can be handled elsewhere, but this is the overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="modal-overlay" onClick={() => setIsOpen(false)} style={{ zIndex: 9999, alignItems: 'flex-start', paddingTop: '10vh' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '600px',
                background: 'var(--bg-secondary)',
                borderRadius: '12px',
                border: '1px solid var(--border-primary)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--border-primary)' }}>
                <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginRight: '0.75rem' }}>🔍</span>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Search challenges, users, or jump to..."
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '1.2rem',
                    color: 'var(--text-primary)',
                  }}
                />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--bg-tertiary)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                  ESC
                </span>
              </div>

              <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '0.5rem' }}>
                {results.length === 0 && query && (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No results found for "{query}"
                  </div>
                )}
                {results.length === 0 && !query && (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Type to start searching...
                  </div>
                )}
                {results.map((result, index) => (
                  <div
                    key={result.id}
                    onClick={() => handleSelect(result.url)}
                    style={{
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: index === selectedIndex ? 'var(--bg-hover)' : 'transparent',
                      color: index === selectedIndex ? 'var(--accent-primary)' : 'var(--text-primary)',
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>
                        {result.type === 'challenge' ? '⚔️' : result.type === 'user' ? '👤' : '📄'}
                      </span>
                      <span>{result.title}</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                      {result.type}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
