import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const devLinks = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/challenges', icon: '⚔️', label: 'Challenges' },
  { to: '/skill-trees', icon: '🌳', label: 'Skill Trees' },
  { to: '/projects', icon: '🚀', label: 'Projects' },
  { to: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
  { to: '/ai-advisor', icon: '🤖', label: 'AI Advisor' },
];

const recruiterLinks = [
  { to: '/recruiter', icon: '📋', label: 'Dashboard' },
  { to: '/recruiter/talent', icon: '🔍', label: 'Talent Search' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const location = useLocation();
  const hiddenPaths = ['/', '/login', '/register', '/pricing'];

  const [isDesktop, setIsDesktop] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth > 768 : true
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!user || hiddenPaths.includes(location.pathname)) return null;

  const links = user.role === 'recruiter' ? recruiterLinks : devLinks;

  // Close sidebar on mobile when a link is clicked
  const handleLinkClick = () => {
    if (!isDesktop && onClose) {
      onClose();
    }
  };

  return (
    <motion.aside
      initial={{ x: isDesktop ? 0 : '-100%' }}
      animate={{ x: (isDesktop || isOpen) ? 0 : '-100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="sidebar"
    >
      <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" onClick={handleLinkClick} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'var(--accent-gradient)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: '0.875rem', color: 'white',
          }}>DA</div>
          <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
            DEV<span style={{ color: 'var(--accent-primary)' }}>ARENA</span>
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="mobile-only btn btn-icon"
            aria-label="Close navigation menu"
            style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', background: 'transparent', border: 'none', minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            ✕
          </button>
        )}
      </div>

      <div style={{ padding: '0 1rem', flex: 1 }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', paddingLeft: '0.75rem' }}>
          Navigation
        </p>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={handleLinkClick}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.625rem 0.75rem', borderRadius: 10,
              color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
              background: isActive ? 'var(--accent-primary-glow)' : 'transparent',
              fontWeight: isActive ? 600 : 500, fontSize: '0.9375rem',
              textDecoration: 'none', marginBottom: '0.25rem',
              transition: 'all 150ms ease', minHeight: '44px',
            })}
          >
            <span style={{ fontSize: '1.1rem' }}>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}

        {/* Admin Section */}
        {user.role === 'admin' && (
          <>
            <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '1.5rem', marginBottom: '0.75rem', paddingLeft: '0.75rem' }}>
              Admin
            </p>
            <NavLink to="/admin/challenges"
              onClick={handleLinkClick}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.625rem 0.75rem', borderRadius: 10,
                color: isActive ? '#e17055' : 'var(--text-secondary)',
                background: isActive ? 'rgba(225,112,85,0.1)' : 'transparent',
                fontWeight: isActive ? 600 : 500, fontSize: '0.9375rem',
                textDecoration: 'none', marginBottom: '0.25rem',
                transition: 'all 150ms ease', minHeight: '44px',
              })}
            >
              <span style={{ fontSize: '1.1rem' }}>🛡️</span>
              Review Challenges
            </NavLink>
          </>
        )}
      </div>

      {user.role === 'developer' && (
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-primary)', margin: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="level-badge">{user.level}</div>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user.username}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Level {user.level}</p>
            </div>
          </div>
          <div className="xp-bar-container" style={{ marginTop: '0.75rem' }}>
            <div className="xp-bar-fill" style={{ width: `${Math.min((user.xp % 100) / 100 * 100, 100)}%` }} />
          </div>
        </div>
      )}
    </motion.aside>
  );
}

