import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import ReactMarkdown from 'react-markdown';

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am **DevArena AI**. How can I help you level up today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      // Pass the recent conversation context to Gemini
      const contextPrompt = messages.slice(-5).map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`).join('\n') + `\nUser: ${userMsg}`;
      
      const res = await api.post('/ai/chat', { prompt: contextPrompt });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting right now.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              position: 'absolute',
              bottom: '4.5rem',
              right: 0,
              width: '350px',
              height: '500px',
              background: 'rgba(var(--bg-secondary-rgb, 18, 18, 26), 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-success)', boxShadow: '0 0 10px var(--color-success)' }} />
                <span style={{ fontWeight: 600, fontSize: '1rem' }}>DevArena Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}>✖</button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: msg.role === 'user' ? '1.2rem 1.2rem 0.2rem 1.2rem' : '1.2rem 1.2rem 1.2rem 0.2rem',
                    background: msg.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                    color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    boxShadow: 'var(--shadow-sm)',
                    border: msg.role === 'user' ? 'none' : '1px solid var(--border-primary)'
                  }}>
                    {msg.role === 'user' ? msg.content : (
                      <div className="markdown-body" style={{ fontSize: '0.9rem' }}>
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div style={{ alignSelf: 'flex-start', padding: '0.75rem 1rem', borderRadius: '1.2rem 1.2rem 1.2rem 0.2rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '20px' }}>
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-secondary)' }} />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-secondary)' }} />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-secondary)' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border-primary)', background: 'var(--bg-tertiary)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="text"
                className="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                style={{ flex: 1, padding: '0.75rem 1rem', fontSize: '0.9rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
              />
              <button 
                className="btn btn-primary" 
                onClick={handleSend} 
                disabled={isLoading} 
                style={{ borderRadius: '50%', width: '42px', height: '42px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: 'none', cursor: 'pointer', background: 'var(--accent-primary)', color: 'white' }}
              >
                {isLoading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }} />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--level-gradient)',
          border: 'none',
          color: 'white',
          fontSize: '1.5rem',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-glow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isOpen ? '✕' : '💬'}
      </motion.button>
    </div>
  );
}
