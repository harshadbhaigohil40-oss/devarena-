import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const difficultyColors = {
  beginner: 'var(--color-success)',
  intermediate: 'var(--color-warning)',
  advanced: 'var(--color-danger)'
};

export default function ChallengeCard({ challenge, index }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={`/challenges/${challenge.slug}`} className="challenge-card-link">
        <div className="card challenge-card">
          {/* Hover Glow Background */}
          <div 
            className="hover-glow-bg" 
            style={{ background: `radial-gradient(circle, ${difficultyColors[challenge.difficulty]}15 0%, transparent 50%)` }} 
          />
          
          <div className="challenge-card-content">
            <div className="flex justify-between items-start mb-md">
              <span 
                className="challenge-difficulty-badge"
                style={{ 
                  background: `${difficultyColors[challenge.difficulty]}15`,
                  border: `1px solid ${difficultyColors[challenge.difficulty]}40`,
                  color: difficultyColors[challenge.difficulty],
                  boxShadow: `0 0 10px ${difficultyColors[challenge.difficulty]}20`
                }}
              >
                {challenge.difficulty}
              </span>
              <div className="challenge-xp-badge">
                <span>⚡ {challenge.xpReward} XP</span>
              </div>
            </div>
            
            <h3 className="mb-sm challenge-card-title">
              {challenge.title}
              {challenge.completed && <span className="ml-xs text-success" title="Completed">✓</span>}
            </h3>
            
            <div className="flex gap-xs mb-lg challenge-tags">
              <span className="badge badge-primary text-xs category-badge">
                {challenge.category}
              </span>
              {challenge.tags?.slice(0, 2).map(tag => (
                <span key={tag} className="badge text-xs topic-badge">
                  {tag}
                </span>
              ))}
              {challenge.tags?.length > 2 && (
                <span className="badge text-xs topic-badge">
                  +{challenge.tags.length - 2}
                </span>
              )}
            </div>
            
            <div className="mt-auto pt-md challenge-card-footer">
              <span className="flex items-center gap-xs">
                <span className="opacity-50">👥</span> {challenge.attemptCount || 0} attempts
              </span>
              <span className="flex items-center gap-xs">
                <span className="opacity-50">✅</span> {challenge.completionCount || 0} solved
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
