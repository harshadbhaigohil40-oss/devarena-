import { motion } from 'framer-motion';

export function ProfileSkeleton() {
  return (
    <div className="page-container" style={{ opacity: 0.7 }}>
      {/* Profile Header */}
      <div className="card mb-xl flex items-center gap-lg">
        <div className="skeleton skeleton-avatar" style={{ width: '120px', height: '120px' }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton skeleton-title" style={{ width: '40%' }} />
          <div className="skeleton skeleton-text" style={{ width: '60%' }} />
          <div className="skeleton skeleton-text" style={{ width: '30%' }} />
        </div>
      </div>

      <div className="grid grid-3">
        <div className="card" style={{ gridColumn: 'span 1' }}>
          <div className="skeleton skeleton-text" style={{ width: '50%', marginBottom: '1.5rem' }} />
          <div className="skeleton skeleton-text" style={{ width: '100%' }} />
          <div className="skeleton skeleton-text" style={{ width: '90%' }} />
          <div className="skeleton skeleton-text" style={{ width: '80%' }} />
        </div>
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="skeleton skeleton-text" style={{ width: '30%', marginBottom: '2rem' }} />
          <div className="skeleton" style={{ height: '250px', width: '100%' }} />
        </div>
      </div>
    </div>
  );
}
