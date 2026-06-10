import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', textAlign: 'center', padding: '1rem' }}>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
        <h1 style={{ fontSize: '6rem', background: 'var(--level-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem', lineHeight: 1 }}>404</h1>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Level Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: 400, margin: '0 auto 2rem' }}>
          Looks like you've ventured out of bounds. The challenge or profile you're looking for doesn't exist in this arena.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">Return to Base</Link>
      </motion.div>
    </div>
  );
}
