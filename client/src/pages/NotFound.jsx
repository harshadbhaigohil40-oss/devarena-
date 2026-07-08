import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';

export default function NotFound() {
  return (
    <PageTransition>
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'var(--bg-primary)', 
        textAlign: 'center', 
        padding: '1rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background grids and floating elements */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.05, backgroundImage: 'radial-gradient(var(--accent-primary) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          style={{ position: 'absolute', top: '15%', left: '20%', fontSize: '4rem', filter: 'blur(4px)' }}>
          👾
        </motion.div>
        <motion.div 
          animate={{ y: [0, 30, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
          style={{ position: 'absolute', bottom: '25%', right: '20%', fontSize: '5rem', filter: 'blur(3px)' }}>
          🛸
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }}
          style={{ zIndex: 1, background: 'var(--bg-secondary)', padding: '4rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-primary)', boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.05)' }}
        >
          <motion.h1 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            style={{ 
              fontSize: '8rem', 
              fontWeight: 900,
              background: 'linear-gradient(135deg, var(--color-error), #ff9f43)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent', 
              marginBottom: '1rem', 
              lineHeight: 1,
              textShadow: '0 10px 30px rgba(231, 76, 60, 0.3)'
            }}
          >
            404
          </motion.h1>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: 800 }}>Level Out of Bounds</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: 450, margin: '0 auto 2.5rem', fontSize: '1.1rem', lineHeight: 1.6 }}>
            You've ventured into uncharted memory space. The challenge, profile, or node you're seeking has been garbage collected or doesn't exist.
          </p>
          <Link to="/">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px var(--accent-primary)' }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary btn-lg"
              style={{ fontSize: '1.2rem', padding: '1rem 2.5rem' }}
            >
              Return to Base 🚀
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </PageTransition>
  );
}
