import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useThemeStore } from '../../features/theme/useThemeStore';
import { motion } from 'framer-motion';
import { formatNumber } from '../../utils/helpers';
import { useState, useEffect, useRef } from 'react';
import { notificationService } from '../../services';
import toast from 'react-hot-toast';

export default function Navbar({ onMenuClick }) {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();
  const isPublic = ['/', '/login', '/register', '/pricing'].includes(location.pathname);
  const isLanding = location.pathname === '/';

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [publicMenuOpen, setPublicMenuOpen] = useState(false);
  const notifRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setShowNotifications(false);
    setPublicMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isAuthenticated) {
      notificationService.getNotifications().then(res => {
        setNotifications(res.data.data.notifications || []);
        setUnreadCount(res.data.data.unreadCount || 0);
      }).catch(console.error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        className={`navbar ${isPublic ? 'navbar-landing' : 'navbar-app'}`}
      >
        {/* Left Side: Hamburger & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
          {/* App Sidebar Hamburger (Only for pages with sidebar) */}
          {!isPublic && onMenuClick && (
            <button 
              className="btn btn-icon mobile-only" 
              onClick={onMenuClick}
              aria-label="Open navigation menu"
              style={{ fontSize: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-primary)', minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              ☰
            </button>
          )}

          {/* Public Hamburger (Only for public pages on mobile) */}
          {isPublic && (
            <button
              className="btn btn-icon mobile-only"
              onClick={() => setPublicMenuOpen(!publicMenuOpen)}
              aria-label="Toggle public navigation"
              style={{ fontSize: '1.35rem', background: 'transparent', border: 'none', color: 'var(--text-primary)', minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              {publicMenuOpen ? '✕' : '☰'}
            </button>
          )}

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--accent-gradient)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: '0.75rem', color: 'white', flexShrink: 0
            }}>DA</div>
            <span className="navbar-logo-text" style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
              DEV<span style={{ color: 'var(--accent-primary)' }}>ARENA</span>
            </span>
          </Link>

          {/* Public Desktop Navigation Links */}
          {isPublic && (
            <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginLeft: '1.5rem' }}>
              <Link 
                to="/pricing" 
                style={{ 
                  color: location.pathname === '/pricing' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: 600, fontSize: '0.9375rem', textDecoration: 'none', transition: 'color 0.2s'
                }}
              >
                Pricing
              </Link>
            </div>
          )}
        </div>

        {/* Right Side: Navbar Actions */}
        <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Quick Search Ctrl+K Button on App Pages */}
          {!isPublic && (
            <button 
              onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
              className="btn btn-ghost btn-sm flex items-center gap-sm navbar-search-btn desktop-only"
            >
              <span>🔍 Search...</span>
              <span className="navbar-search-shortcut">Ctrl K</span>
            </button>
          )}
          
          {/* Notifications Bell - Authenticated Only */}
          {isAuthenticated && (
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="btn btn-icon" 
                style={{ fontSize: '1.25rem', background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative', minWidth: 44, minHeight: 44 }} 
                aria-label="Notifications"
              >
                🔔
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: 2, right: 2, background: 'var(--accent-primary)',
                    color: 'white', fontSize: '0.65rem', fontWeight: 'bold', padding: '0.1rem 0.3rem',
                    borderRadius: '10px', transform: 'translate(25%, -25%)'
                  }}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-dropdown">
                  <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllAsRead} style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '0.8rem' }}>
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n._id} 
                          onClick={() => !n.isRead && handleMarkAsRead(n._id)}
                          style={{ 
                            padding: '1rem', borderBottom: '1px solid var(--border-secondary)', 
                            background: n.isRead ? 'transparent' : 'var(--bg-tertiary)',
                            cursor: n.isRead ? 'default' : 'pointer',
                            transition: 'background 0.2s'
                          }}
                        >
                          <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{n.title}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme} 
            className="btn btn-icon" 
            style={{ fontSize: '1.2rem', background: 'transparent', border: 'none', cursor: 'pointer', minWidth: 44, minHeight: 44 }} 
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* User Auth Buttons */}
          {isAuthenticated ? (
            <button 
              onClick={logout} 
              className="btn btn-ghost btn-sm" 
              style={{ color: 'var(--text-secondary)', minHeight: 38, padding: '0.35rem 0.75rem' }}
            >
              Logout
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link 
                to="/login" 
                className="btn btn-ghost btn-sm desktop-only" 
                style={{ minHeight: 38, padding: '0.35rem 0.75rem' }}
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="btn btn-primary btn-sm" 
                style={{ minHeight: 38, padding: '0.4rem 0.85rem', whiteSpace: 'nowrap' }}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown for Public Pages */}
      {isPublic && publicMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="card card-glass mobile-only"
          style={{
            position: 'fixed',
            top: 'calc(var(--navbar-height) + 8px)',
            left: '1rem',
            right: '1rem',
            zIndex: 100,
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <Link 
            to="/" 
            onClick={() => setPublicMenuOpen(false)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem', 
              color: 'var(--text-primary)', fontWeight: 600, textDecoration: 'none',
              padding: '0.5rem', borderRadius: '8px'
            }}
          >
            🏠 Home
          </Link>
          <Link 
            to="/pricing" 
            onClick={() => setPublicMenuOpen(false)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem', 
              color: 'var(--text-primary)', fontWeight: 600, textDecoration: 'none',
              padding: '0.5rem', borderRadius: '8px'
            }}
          >
            💎 Pricing
          </Link>
          {!isAuthenticated && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border-primary)', paddingTop: '1rem' }}>
              <Link 
                to="/login" 
                onClick={() => setPublicMenuOpen(false)}
                className="btn btn-secondary" 
                style={{ width: '100%' }}
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                onClick={() => setPublicMenuOpen(false)}
                className="btn btn-primary" 
                style={{ width: '100%' }}
              >
                Get Started
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </>
  );
}
