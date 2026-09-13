import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';

export default function NotFound() {
  return (
    <PageTransition>
      <div style={{ 
        minHeight: '100dvh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'var(--bg-primary)', 
        textAlign: 'center', 
        padding: 'clamp(1rem, 3vw, 2rem)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background grids and floating elements */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.05, backgroundImage: 'radial-gradient(var(--accent-primary) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          style={{ position: 'absolute', top: '15%', left: '10%', fontSize: 'clamp(2.5rem, 6vw, 4rem)', filter: 'blur(4px)' }}>
          👾
        </motion.div>
        <motion.div 
          animate={{ y: [0, 30, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
          style={{ position: 'absolute', bottom: '15%', right: '10%', fontSize: 'clamp(3rem, 7vw, 5rem)', filter: 'blur(3px)' }}>
          🛸
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }}
          style={{ zIndex: 1, background: 'var(--bg-secondary)', padding: 'clamp(1.5rem, 5vw, 3.5rem)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-primary)', boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.05)', maxWidth: '100%', width: 'min(550px, 100%)', boxSizing: 'border-box' }}
        >
          <motion.h1 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            style={{ 
              fontSize: 'clamp(4.5rem, 16vw, 8rem)', 
              fontWeight: 900,
              background: 'linear-gradient(135deg, var(--color-error), #ff9f43)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent', 
              marginBottom: '0.75rem', 
              lineHeight: 1,
              textShadow: '0 10px 30px rgba(231, 76, 60, 0.3)'
            }}
          >
            404
          </motion.h1>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', marginBottom: '1rem', fontWeight: 800 }}>Level Out of Bounds</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: 450, margin: '0 auto 2rem', fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)', lineHeight: 1.6 }}>
            You've ventured into uncharted memory space. The challenge, profile, or node you're seeking has been garbage collected or doesn't exist.
          </p>
          <Link to="/">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px var(--accent-primary)' }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary btn-lg btn-wrap"
              style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', padding: '0.85rem 2rem', maxWidth: '100%' }}
            >
              Return to Base 🚀
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </PageTransition>
  );
}
