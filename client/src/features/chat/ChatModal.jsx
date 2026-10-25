import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { useChatStore } from '@/store/useChatStore';
import toast from 'react-hot-toast';

export default function ChatModal({ user, onClose }) {
  const { user: currentUser } = useAuth();
  const { socket } = useSocket();
  const { messages, loadingMessages, setActiveConversation } = useChatStore();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user?._id) {
      setActiveConversation(user);
    }
  }, [user?._id, setActiveConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!user) return null;

  const handleSend = (e) => {
    e.preventDefault();
    const content = inputText.trim();
    if (!content) return;

    if (!socket || !socket.connected) {
      toast.error('Chat connection offline. Reconnecting...');
      return;
    }

    socket.emit('send:message', {
      receiverId: user._id,
      content,
    });

    setInputText('');
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="card card-glass"
        style={{ 
          width: '100%', 
          maxWidth: '520px', 
          height: 'min(620px, 85vh)', 
          display: 'flex', 
          flexDirection: 'column', 
          padding: 0, 
          overflow: 'hidden',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Header */}
        <div style={{ 
          padding: '1rem 1.25rem', 
          borderBottom: '1px solid var(--border-primary)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          background: 'var(--bg-tertiary)' 
        }}>
          <div className="flex items-center gap-sm">
            <div className="level-badge" style={{ width: 34, height: 34, fontSize: '0.85rem' }}>
              {user.level || 1}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {user.username}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-success, #10b981)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                Direct Chat
              </span>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="btn btn-icon" 
            style={{ border: 'none', background: 'transparent', fontSize: '1.4rem', color: 'var(--text-secondary)', cursor: 'pointer', lineHeight: 1 }}
            aria-label="Close chat"
          >
            &times;
          </button>
        </div>

        {/* Message Thread Area */}
        <div style={{ 
          flex: 1, 
          padding: '1.25rem', 
          overflowY: 'auto', 
          background: 'var(--bg-primary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {loadingMessages ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto', fontSize: '0.9rem' }}>
              Loading message history...
            </div>
          ) : messages.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto', padding: '2rem 1rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💬</div>
              <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Start a conversation</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem' }}>Say hello to {user.username} to initiate contact.</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMe = String(msg.senderId) === String(currentUser?._id);
              const timeStr = msg.createdAt 
                ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                : '';

              return (
                <div 
                  key={msg._id || idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '82%',
                    alignSelf: isMe ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div
                    style={{
                      padding: '0.65rem 1rem',
                      borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: isMe 
                        ? 'var(--accent-gradient, linear-gradient(135deg, #6c5ce7 0%, #a855f7 100%))' 
                        : 'var(--bg-secondary)',
                      color: isMe ? '#ffffff' : 'var(--text-primary)',
                      border: isMe ? 'none' : '1px solid var(--border-primary)',
                      fontSize: '0.9rem',
                      lineHeight: 1.45,
                      wordBreak: 'break-word',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    {msg.content}
                  </div>
                  {timeStr && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '3px', padding: '0 4px' }}>
                      {timeStr}
                    </span>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={handleSend}
          style={{ 
            padding: '0.875rem 1rem', 
            borderTop: '1px solid var(--border-primary)', 
            background: 'var(--bg-secondary)',
            display: 'flex',
            gap: '0.5rem'
          }}
        >
          <input 
            type="text" 
            className="input" 
            placeholder={`Message ${user.username}...`} 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ flex: 1, borderRadius: '24px', padding: '0.6rem 1rem', fontSize: '0.9rem' }} 
            autoFocus
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!inputText.trim()}
            style={{ borderRadius: '24px', padding: '0.6rem 1.25rem', fontWeight: 600 }}
          >
            Send
          </button>
        </form>
      </motion.div>
    </div>
  );
}
