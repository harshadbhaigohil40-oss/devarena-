export function ChallengeSkeleton() {
  return (
    <div className="page-container" style={{ opacity: 0.7 }}>
      <div className="page-header mb-xl">
        <div className="skeleton skeleton-title" style={{ width: '30%' }} />
        <div className="skeleton skeleton-text" style={{ width: '50%' }} />
      </div>

      <div className="grid grid-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card skeleton-card flex-col justify-between">
            <div>
              <div className="skeleton skeleton-title" style={{ width: '70%', height: '20px' }} />
              <div className="skeleton skeleton-text" style={{ width: '100%', marginTop: '1rem' }} />
              <div className="skeleton skeleton-text" style={{ width: '80%' }} />
            </div>
            <div className="flex justify-between items-center mt-md">
              <div className="skeleton skeleton-text" style={{ width: '30%', margin: 0 }} />
              <div className="skeleton skeleton-text" style={{ width: '20%', margin: 0 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
