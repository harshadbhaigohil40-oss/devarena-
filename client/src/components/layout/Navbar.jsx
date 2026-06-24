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
  const isLanding = ['/', '/login', '/register'].includes(location.pathname);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      {(isLanding || isMobile) && (
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
        
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn btn-icon" 
            style={{ fontSize: '1.25rem', background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative' }} 
            aria-label="Notifications"
          >
            🔔
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: 0, right: 0, background: 'var(--accent-primary)',
                color: 'white', fontSize: '0.65rem', fontWeight: 'bold', padding: '0.1rem 0.3rem',
                borderRadius: '10px', transform: 'translate(25%, -25%)'
              }}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute', top: '120%', right: 0, width: '320px',
              background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
              borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              overflow: 'hidden', zIndex: 100
            }}>
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
