import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useThemeStore } from '../../features/theme/useThemeStore';
import { motion } from 'framer-motion';
import { formatNumber } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function Navbar({ onMenuClick }) {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();
  const isLanding = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <motion.nav
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      className="navbar"
      style={{
        position: 'fixed', top: 0, left: isLanding ? 0 : 'var(--sidebar-width)', right: 0, height: 'var(--navbar-height)',
        background: 'var(--bg-secondary)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-primary)', zIndex: 40,
        display: 'flex', alignItems: 'center', padding: '0 1.5rem',
        justifyContent: isLanding ? 'space-between' : 'flex-end',
        transition: 'left var(--transition-normal)'
      }}
    >
      {/* Show Logo only on Landing/Auth pages where sidebar is hidden */}
      {(isLanding || window.innerWidth <= 768) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {onMenuClick && !isLanding && (
            <button 
              className="btn btn-icon" 
              onClick={onMenuClick}
              style={{ fontSize: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-primary)' }}
            >
              ☰
            </button>
          )}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--accent-gradient)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: '0.75rem', color: 'white',
            }}>DA</div>
            <span style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--text-primary)' }}>
              DEV<span style={{ color: 'var(--accent-primary)' }}>ARENA</span>
            </span>
          </Link>
        </div>
      )}

      {/* Top Navbar Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {!isLanding && (
          <button 
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
            className="btn btn-ghost btn-sm flex items-center gap-sm" 
            style={{ color: 'var(--text-secondary)', background: 'var(--bg-secondary)', borderRadius: '20px', padding: '0.35rem 1rem', border: '1px solid var(--border-primary)' }}
          >
            <span>🔍 Search...</span>
            <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.3rem', background: 'var(--bg-tertiary)', borderRadius: '4px', border: '1px solid var(--border-secondary)' }}>Ctrl K</span>
          </button>
        )}
        
        <button 
          onClick={() => toast('No new notifications right now!', { icon: '🔔', style: { borderRadius: '10px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' } })}
          className="btn btn-icon" 
          style={{ fontSize: '1.25rem', background: 'transparent', border: 'none', cursor: 'pointer' }} 
          aria-label="Notifications"
        >
          🔔
        </button>
        
        <button onClick={toggleTheme} className="btn btn-icon" style={{ fontSize: '1.25rem', background: 'transparent', border: 'none', cursor: 'pointer' }} aria-label="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {isAuthenticated ? (
          <>
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
