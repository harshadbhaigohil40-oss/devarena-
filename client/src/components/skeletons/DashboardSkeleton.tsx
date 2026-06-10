import { motion } from 'framer-motion';

export function DashboardSkeleton() {
  return (
    <div className="page-container" style={{ opacity: 0.7 }}>
      <div className="page-header mb-xl">
        <div className="skeleton skeleton-title" style={{ width: '40%' }} />
        <div className="skeleton skeleton-text" style={{ width: '25%' }} />
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-4 mb-xl">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card">
            <div className="skeleton skeleton-text" style={{ width: '50%', marginBottom: '1rem' }} />
            <div className="skeleton skeleton-title" style={{ width: '80%', height: '36px', marginBottom: 0 }} />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-2 mb-xl">
        <div className="card">
          <div className="skeleton skeleton-text" style={{ width: '30%', marginBottom: '2rem' }} />
          <div className="skeleton" style={{ height: '300px', width: '100%', borderRadius: 'var(--radius-md)' }} />
        </div>
        <div className="card">
          <div className="skeleton skeleton-text" style={{ width: '30%', marginBottom: '2rem' }} />
          <div className="skeleton" style={{ height: '300px', width: '100%', borderRadius: '50%' }} />
        </div>
      </div>

      {/* Heatmap Row */}
      <div className="card">
        <div className="skeleton skeleton-text" style={{ width: '20%', marginBottom: '1.5rem' }} />
        <div className="skeleton" style={{ height: '150px', width: '100%', borderRadius: 'var(--radius-md)' }} />
      </div>
    </div>
  );
}
