import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import ChatMarkdown from './ChatMarkdown';

const QUICK_SUGGESTIONS = [
  '💡 Explain recursion with an example',
  '⚡ How can I optimize my algorithms?',
  '🚀 How do I earn XP and level up fast?',
  '💻 Write a binary search in JavaScript'
];

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am **DevArena AI**. How can I help you level up today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom('auto');
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages, isLoading]);

  const handleSendPrompt = async (promptToSend) => {
    const text = (promptToSend ?? input).trim();
    if (!text || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setIsLoading(true);

    try {
      // Pass the recent conversation context to Gemini
      const contextPrompt = messages.slice(-5).map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`).join('\n') + `\nUser: ${text}`;
      
      const res = await api.post('/ai/chat', { prompt: contextPrompt });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.data.reply }]);
    } catch (error) {
      const apiError = error.response?.data?.error || error.response?.data?.message;
      const fallbackMsg = "Oops! My AI circuits are a bit scrambled right now (Server Error). Please try again in a moment! 🤖🔌";
      setMessages(prev => [...prev, { role: 'assistant', content: apiError || fallbackMsg }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleClearChat = () => {
    setMessages([
      { role: 'assistant', content: 'Conversation cleared! How else can I assist your coding journey today? 🚀' }
    ]);
  };

  return (
    <div className="chatbot-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="chatbot-panel"
          >
            {/* Header */}
            <div className="chatbot-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ position: 'relative', width: '32px', height: '32px', borderRadius: '50%', background: 'var(--level-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                  🤖
                  <div style={{ position: 'absolute', bottom: -1, right: -1, width: 9, height: 9, borderRadius: '50%', background: 'var(--color-success)', border: '2px solid var(--bg-primary)' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>DevArena AI</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Online</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {messages.length > 1 && (
                  <button 
                    onClick={handleClearChat}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s' }}
                    title="Clear chat"
                    aria-label="Clear chat"
                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                )}
                <button 
                  onClick={() => setIsOpen(false)} 
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', lineHeight: 1 }}
                  title="Close"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="chatbot-messages-container">
              {messages.map((msg, i) => (
                <div key={i} className={msg.role === 'user' ? 'chatbot-bubble-user' : 'chatbot-bubble-ai'}>
                  <div className={msg.role === 'user' ? 'chatbot-bubble-user-inner' : 'chatbot-bubble-ai-inner'}>
                    {msg.role === 'user' ? (
                      <span>{msg.content}</span>
                    ) : (
                      <ChatMarkdown>{msg.content}</ChatMarkdown>
                    )}
                  </div>
                </div>
              ))}

              {/* Quick suggestions when conversation is fresh */}
              {messages.length === 1 && !isLoading && (
                <div className="chatbot-suggestions">
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
                    Suggested Topics
                  </span>
                  {QUICK_SUGGESTIONS.map((sugg, index) => (
                    <button
                      key={index}
                      type="button"
                      className="chatbot-chip"
                      onClick={() => handleSendPrompt(sugg.replace(/^[^\w]+/, ''))}
                    >
                      {sugg}
                    </button>
                  ))}
                </div>
              )}

              {/* Loading indicator */}
              {isLoading && (
                <div className="chatbot-bubble-ai">
                  <div className="chatbot-bubble-ai-inner" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.85rem' }}>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '16px' }}>
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)' }} />
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)' }} />
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)' }} />
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>AI thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={(e) => { e.preventDefault(); handleSendPrompt(); }} className="chatbot-input-bar">
              <input
                ref={inputRef}
                type="text"
                className="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about code, algorithms, or careers..."
                enterKeyHint="send"
                style={{
                  flex: 1,
                  padding: '0.65rem 0.9rem',
                  fontSize: '16px', // Prevents iOS auto-zoom
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  minHeight: '40px'
                }}
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="btn btn-primary"
                style={{
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: 'none',
                  cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                  background: !input.trim() && !isLoading ? 'rgba(255, 255, 255, 0.1)' : 'var(--accent-primary)',
                  color: 'white',
                  transition: 'all 0.2s ease'
                }}
                title="Send message"
                aria-label="Send message"
              >
                {isLoading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }} />
                ) : (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close DevArena AI chat" : "Open DevArena AI chat"}
        title="DevArena AI Chat"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--level-gradient)',
          border: 'none',
          color: 'white',
          fontSize: '1.4rem',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(138, 43, 226, 0.4), 0 0 12px rgba(138, 43, 226, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} style={{ fontSize: '1.2rem', lineHeight: 1 }}>
              ✕
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              💬
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
