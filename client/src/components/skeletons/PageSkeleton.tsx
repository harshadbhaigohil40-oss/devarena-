import React from 'react';

export const PageSkeleton = () => {
  return (
    <div className="page-container" style={{ opacity: 0.7 }}>
      <div className="skeleton" style={{ width: '30%', height: '3rem', marginBottom: '1rem', borderRadius: '8px' }} />
      <div className="skeleton" style={{ width: '50%', height: '1.5rem', marginBottom: '2.5rem', borderRadius: '4px' }} />
      
      <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton" style={{ height: '150px', borderRadius: '12px' }} />
        ))}
      </div>
      
      <div className="skeleton" style={{ height: '300px', width: '100%', borderRadius: '12px' }} />
    </div>
  );
};
