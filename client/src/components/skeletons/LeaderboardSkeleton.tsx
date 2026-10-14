export function LeaderboardSkeleton() {
  return (
    <div className="page-container" style={{ opacity: 0.7 }}>
      <div className="page-header text-center mb-xl">
        <div className="skeleton skeleton-title" style={{ width: '30%', margin: '0 auto 1rem' }} />
        <div className="skeleton skeleton-text" style={{ width: '50%', margin: '0 auto' }} />
      </div>

      <div className="card">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <div key={i} className="flex items-center justify-between" style={{ padding: '1rem', borderBottom: '1px solid var(--border-primary)' }}>
            <div className="flex items-center gap-md" style={{ flex: 1 }}>
              <div className="skeleton skeleton-avatar" style={{ width: '24px', height: '24px' }} />
              <div className="skeleton skeleton-avatar" style={{ width: '40px', height: '40px' }} />
              <div className="skeleton skeleton-title" style={{ width: '30%', height: '20px', margin: 0 }} />
            </div>
            <div className="skeleton skeleton-title" style={{ width: '15%', height: '20px', margin: 0 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
