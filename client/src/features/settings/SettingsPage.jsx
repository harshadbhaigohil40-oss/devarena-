import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useThemeStore } from '../theme/useThemeStore';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useThemeStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const availableThemes = [
    { id: 'light', name: 'Light', color: '#ffffff', accent: '#6c5ce7' },
    { id: 'dark', name: 'Dark', color: '#0a0a0f', accent: '#6c5ce7' },
    { id: 'cyberpunk', name: 'Cyberpunk', color: '#0a0a0a', accent: '#ff0055' },
    { id: 'dracula', name: 'Dracula', color: '#282a36', accent: '#bd93f9' },
    { id: 'ocean', name: 'Ocean', color: '#0f172a', accent: '#3b82f6' },
    { id: 'forest', name: 'Forest', color: '#022c22', accent: '#10b981' },
    { id: 'midnight', name: 'Midnight', color: '#000000', accent: '#d4d4d4' },
    { id: 'shadow', name: 'Shadow', color: '#050505', accent: '#8a2be2' }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container" style={{ maxWidth: 800 }}>
      <div className="page-header mb-lg">
        <h1>Account Settings</h1>
        <p>Manage your preferences and security</p>
      </div>

      {/* General Settings */}
      <div className="card mb-xl">
        <h3 className="mb-md">Profile Information</h3>
        <div className="input-group mb-sm">
          <label>Username</label>
          <input className="input" value={user.username} disabled />
        </div>
        <div className="input-group mb-sm">
          <label>Email Address</label>
          <input className="input" value={user.email} disabled />
        </div>
      </div>

      {/* Theme Settings */}
      <div className="card mb-xl">
        <h3 className="mb-md">Theme Personalization</h3>
        <p className="text-muted mb-md text-sm">Choose the aesthetic that fits your workflow.</p>
        <div className="grid grid-4" style={{ gap: '1rem' }}>
          {availableThemes.map((t) => (
            <motion.div
              key={t.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme(t.id)}
              style={{
                cursor: 'pointer',
                borderRadius: '8px',
                border: `2px solid ${theme === t.id ? t.accent : 'var(--border-primary)'}`,
                padding: '1rem',
                background: t.color,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: t.accent, marginBottom: '0.5rem' }} />
              <span style={{ color: theme === t.id ? t.accent : 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</span>
              {theme === t.id && (
                <div style={{ position: 'absolute', top: 5, right: 5, color: t.accent }}>✓</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div 
        className="card" 
        style={{ 
          borderColor: 'var(--color-danger)', 
          background: 'var(--color-danger-bg)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Warning Glow Effect */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', height: 50, background: 'radial-gradient(ellipse, rgba(255, 107, 107, 0.2), transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none' }} />
        
        <h3 className="mb-sm" style={{ color: 'var(--color-danger)' }}>Danger Zone</h3>
        <p className="text-muted text-sm mb-lg">
          These actions are irreversible. Please proceed with caution.
        </p>

        <div className="flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,107,107,0.2)', paddingTop: '1rem' }}>
          <div>
            <h4 style={{ fontSize: '1rem' }}>Delete Account</h4>
            <p className="text-xs text-muted">Permanently delete your account and all associated data.</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDeleteModal(true)}
            className="btn btn-danger"
          >
            Delete Account
          </motion.button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <DeleteAccountModal 
            username={user.username} 
            onClose={() => setShowDeleteModal(false)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DeleteAccountModal({ username, onClose }) {
  const [input, setInput] = useState('');
  const isMatch = input === username;

  const handleDelete = () => {
    if (isMatch) {
      toast.error('Account deletion simulation complete.');
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="card"
        style={{ 
          width: '100%', maxWidth: 450, 
          borderTop: '4px solid var(--color-danger)',
          boxShadow: '0 10px 40px rgba(255, 107, 107, 0.2)'
        }}
      >
        <h2 className="mb-sm">Are you absolutely sure?</h2>
        <p className="text-sm text-muted mb-md">
          This action cannot be undone. This will permanently delete the <strong>{username}</strong> account, 
          along with all your XP, badges, projects, and pipeline data.
        </p>
        
        <div className="input-group mb-md">
          <label>Please type <strong>{username}</strong> to confirm.</label>
          <input 
            type="text" 
            className="input" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder={username}
            style={{ 
              borderColor: input && !isMatch ? 'var(--color-danger)' : isMatch ? 'var(--color-success)' : 'var(--border-primary)'
            }}
          />
        </div>

        <div className="flex gap-sm justify-end">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <motion.button 
            whileTap={isMatch ? { scale: 0.95 } : { x: [-5, 5, -5, 5, 0] }}
            transition={{ duration: 0.2 }}
            className="btn btn-danger" 
            disabled={!isMatch}
            onClick={handleDelete}
            style={{ opacity: isMatch ? 1 : 0.5, cursor: isMatch ? 'pointer' : 'not-allowed' }}
          >
            I understand the consequences, delete this account
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
