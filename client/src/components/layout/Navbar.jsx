import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useThemeStore } from '../../features/theme/useThemeStore';
import { motion } from 'framer-motion';
import { formatNumber } from '../../utils/helpers';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <motion.nav
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      className="navbar"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 'var(--navbar-height)',
        background: 'rgba(var(--bg-primary-rgb, 10, 10, 15), 0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-primary)', zIndex: 100,
        display: 'flex', alignItems: 'center', padding: '0 1.5rem',
        justifyContent: 'space-between',
      }}
    >
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'var(--level-gradient)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, fontSize: '0.75rem', color: 'white',
        }}>DA</div>
        <span style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--text-primary)' }}>
          DEV<span style={{ color: 'var(--accent-primary)' }}>ARENA</span>
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
          className="btn btn-ghost btn-sm flex items-center gap-sm" 
          style={{ color: 'var(--text-secondary)', background: 'var(--bg-tertiary)', borderRadius: '20px', padding: '0.25rem 0.75rem' }}
        >
          <span>🔍 Search...</span>
          <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.3rem', background: 'var(--bg-secondary)', borderRadius: '4px', border: '1px solid var(--border-primary)' }}>Ctrl K</span>
        </button>
        <button onClick={toggleTheme} className="btn btn-icon" style={{ fontSize: '1.25rem', background: 'transparent', border: 'none', cursor: 'pointer' }} aria-label="Toggle theme">
          {theme === 'dark' || theme === 'cyberpunk' || theme === 'midnight' ? '☀️' : '🌙'}
        </button>
        {isAuthenticated ? (
          <>
            {user?.role === 'developer' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="level-badge" style={{ width: 28, height: 28, fontSize: '0.7rem' }}>
                  {user.level}
                </div>
                <span style={{ fontSize: '0.875rem', color: 'var(--xp-gold)', fontWeight: 600 }}>
                  ⚡ {formatNumber(user.xp)} XP
                </span>
              </div>
            )}
            <Link to="/dashboard" className="btn btn-ghost btn-sm">Dashboard</Link>
            <div style={{ position: 'relative' }}>
              <Link to={`/profile/${user._id}`} style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'var(--level-gradient)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.8rem', color: 'white',
                textDecoration: 'none',
              }}>
                {user.username?.charAt(0).toUpperCase()}
              </Link>
            </div>
            <button onClick={logout} className="btn btn-ghost btn-sm" style={{ color: 'var(--text-secondary)' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </>
        )}
      </div>
    </motion.nav>
  );
}
