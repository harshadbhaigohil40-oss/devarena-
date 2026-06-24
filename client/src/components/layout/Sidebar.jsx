import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

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
  const hiddenPaths = ['/', '/login', '/register'];
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!user || hiddenPaths.includes(location.pathname)) return null;

  const links = user.role === 'recruiter' ? recruiterLinks : devLinks;

  return (
    <motion.aside
      initial={{ x: -260 }}
      animate={{ x: isOpen ? 0 : (isMobile ? -260 : 0) }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: 'var(--sidebar-width)', background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-primary)', padding: '1.5rem 0',
        overflowY: 'auto', zIndex: 50,
        display: 'flex', flexDirection: 'column',
      }}
    >
      <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
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
      </div>

      <div style={{ padding: '0 1rem', flex: 1 }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', paddingLeft: '0.75rem' }}>
          Navigation
        </p>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => {
              if (isMobile && onClose) onClose();
            }}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.625rem 0.75rem', borderRadius: 10,
              color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
              background: isActive ? 'var(--accent-primary-glow)' : 'transparent',
              fontWeight: isActive ? 600 : 500, fontSize: '0.9375rem',
              textDecoration: 'none', marginBottom: '0.25rem',
              transition: 'all 150ms ease',
            })}
          >
            <span style={{ fontSize: '1.1rem' }}>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
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
