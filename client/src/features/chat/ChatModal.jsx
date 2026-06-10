import { motion } from 'framer-motion';

export default function ChatModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="card"
        style={{ width: '100%', maxWidth: 500, height: 600, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}
      >
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary)' }}>
          <div className="flex items-center gap-sm">
            <div className="level-badge" style={{ width: 32, height: 32 }}>{user.level || '?'}</div>
            <h3 style={{ margin: 0 }}>{user.username}</h3>
          </div>
          <button onClick={onClose} className="btn btn-icon" style={{ border: 'none', background: 'transparent', fontSize: '1.5rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>&times;</button>
        </div>

        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', background: 'var(--bg-primary)' }}>
          <p className="text-center text-sm text-muted">Chat history with {user.username} will appear here.</p>
          {/* Chat messages would map here */}
        </div>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-primary)', background: 'var(--bg-secondary)' }}>
          <div className="flex gap-sm">
            <input type="text" className="input" placeholder="Type a message..." style={{ flex: 1 }} />
            <button className="btn btn-primary">Send</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
