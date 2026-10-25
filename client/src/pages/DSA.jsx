import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services';
import { useThemeStore } from '../features/theme/useThemeStore';
import toast from 'react-hot-toast';

const DSA_MODULES = [
  { id: 'arrays', title: 'Arrays & Hashing', desc: 'Fundamental data storage and fast lookups', icon: '📦', xp: 100 },
  { id: 'strings', title: 'Strings', desc: 'String manipulation and pattern matching', icon: '📝', xp: 100 },
  { id: 'two-pointers', title: 'Two Pointers', desc: 'Efficient array traversal techniques', icon: '👉', xp: 150 },
  { id: 'sliding-window', title: 'Sliding Window', desc: 'Optimizing continuous subarrays', icon: '🪟', xp: 150 },
  { id: 'stacks', title: 'Stacks', desc: 'LIFO (Last In, First Out) operations', icon: '🥞', xp: 150 },
  { id: 'queues', title: 'Queues', desc: 'FIFO (First In, First Out) operations', icon: '🚶‍♂️', xp: 150 },
  { id: 'linked-lists', title: 'Linked Lists', desc: 'Pointer-based sequences', icon: '🔗', xp: 200 },
  { id: 'trees', title: 'Trees', desc: 'Hierarchical data structures', icon: '🌲', xp: 250 },
  { id: 'bst', title: 'Binary Search Trees', desc: 'Ordered hierarchical data', icon: '🌳', xp: 250 },
  { id: 'heaps', title: 'Heaps / Priority Queue', desc: 'Fast min/max retrieval', icon: '⛰️', xp: 300 },
  { id: 'graphs', title: 'Graphs', desc: 'Nodes and edges for complex relations', icon: '🕸️', xp: 350 },
  { id: 'tries', title: 'Tries', desc: 'Prefix trees for string search', icon: '🔤', xp: 400 },
  { id: 'union-find', title: 'Union-Find', desc: 'Disjoint set operations', icon: '🤝', xp: 400 },
  { id: 'advanced', title: 'Advanced Data Structures', desc: 'Segment trees, Fenwick trees', icon: '🚀', xp: 500 },
];

export default function DSA() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  // Dynamic user progression based on challenges solved
  const [solvedCount, setSolvedCount] = useState(user?.challengesSolved || 0);

  useEffect(() => {
    if (user?._id) {
      userService.getStats(user._id)
        .then(res => {
          const solved = res.data?.data?.challengesSolved ?? user?.challengesSolved ?? 0;
          setSolvedCount(solved);
        })
        .catch(err => {
          console.warn('Could not refresh DSA stats from server:', err);
        });
    }
  }, [user?._id, user?.challengesSolved]);

  // Progression index:
  // 0 challenges: Module 0 (Arrays) is current & unlocked.
  // 1 challenge: Module 0 completed, Module 1 is current & unlocked.
  // If solvedCount >= DSA_MODULES.length, all modules are completed.
  const isAllCompleted = solvedCount >= DSA_MODULES.length;
  const currentModuleIndex = isAllCompleted ? DSA_MODULES.length : Math.max(0, solvedCount);

  const handleModuleClick = (mod, index) => {
    if (index > currentModuleIndex) {
      const activeMod = DSA_MODULES[currentModuleIndex]?.title || 'the current module';
      toast.error(`Module Locked! Solve more challenges or complete "${activeMod}" first.`);
      return;
    }
    toast.success(`Entering ${mod.title} module...`);
    const searchTerm = mod.title.replace(/[&]/g, '').trim();
    setTimeout(() => navigate(`/challenges?search=${encodeURIComponent(searchTerm)}`), 400);
  };

  const progressPercentage = Math.min(
    100,
    (Math.min(currentModuleIndex, DSA_MODULES.length - 1) / (DSA_MODULES.length - 1)) * 100
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
      {/* Header Banner */}
      <div 
        className="dsa-header mb-xl dsa-header-flex"
        style={{
          padding: 'clamp(1.5rem, 5vw, 3rem)',
          borderRadius: '24px',
          background: isLight 
            ? 'linear-gradient(135deg, #FFF1F8 0%, #FCE7F3 100%)' 
            : 'linear-gradient(135deg, rgba(232, 67, 147, 0.1) 0%, rgba(232, 67, 147, 0.02) 100%)',
          border: isLight ? '1px solid #FBCFE8' : '1px solid rgba(232, 67, 147, 0.2)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '-50%', right: '-10%', width: '300px', height: '300px',
          background: '#E84393', filter: 'blur(100px)', opacity: isLight ? 0.15 : 0.1, borderRadius: '50%'
        }} />

        <div style={{
          width: '80px', height: '80px', borderRadius: '24px',
          background: isLight ? '#FFFFFF' : 'rgba(232, 67, 147, 0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.5rem', flexShrink: 0,
          boxShadow: isLight ? '0 10px 25px rgba(232, 67, 147, 0.2)' : '0 10px 30px rgba(0,0,0,0.5)',
          border: isLight ? '1px solid #F9A8D4' : '1px solid rgba(232, 67, 147, 0.3)',
          zIndex: 1
        }}>
          🧩
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 4vw, 2.5rem)', 
            marginBottom: '0.5rem',
            color: isLight ? '#831843' : '#FBCFE8',
            fontWeight: 800
          }}>
            Data Structures & DSA
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            color: isLight ? '#BE185D' : 'rgba(251, 207, 232, 0.7)',
            maxWidth: '600px'
          }}>
            Master data structures from basics to advanced concepts through a structured learning progression.
          </p>

          {/* Dynamic Progress Badges */}
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ 
              fontSize: '0.825rem', 
              padding: '0.35rem 0.85rem', 
              borderRadius: '20px', 
              background: isLight ? 'rgba(232, 67, 147, 0.15)' : 'rgba(232, 67, 147, 0.25)',
              color: isLight ? '#9D174D' : '#FCE7F3',
              fontWeight: 600
            }}>
              🎯 Challenges Solved: {solvedCount}
            </span>
            <span style={{ 
              fontSize: '0.825rem', 
              padding: '0.35rem 0.85rem', 
              borderRadius: '20px', 
              background: isLight ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.25)',
              color: isLight ? '#065F46' : '#A7F3D0',
              fontWeight: 600
            }}>
              🔓 Unlocked: {Math.min(DSA_MODULES.length, currentModuleIndex + 1)} / {DSA_MODULES.length} Modules
            </span>
          </div>
        </div>
      </div>

      {/* Progression Path */}
      <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto', padding: '2rem 0' }}>
        
        {/* Vertical Line */}
        <div 
          className="dsa-timeline-line"
          style={{
            position: 'absolute',
            top: '2rem', bottom: '2rem',
            left: '39px',
            width: '2px',
            background: isLight ? '#FCE7F3' : 'rgba(232, 67, 147, 0.1)',
            zIndex: 0
          }} 
        />

        {/* Active Line Progress */}
        <motion.div 
          className="dsa-timeline-line"
          initial={{ height: 0 }}
          animate={{ height: `${progressPercentage}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            position: 'absolute',
            top: '2rem',
            left: '39px',
            width: '2px',
            background: '#E84393',
            boxShadow: '0 0 10px #E84393',
            zIndex: 1
          }} 
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
          {DSA_MODULES.map((mod, index) => {
            const isCompleted = index < currentModuleIndex;
            const isCurrent = !isAllCompleted && index === currentModuleIndex;
            const isLocked = index > currentModuleIndex;

            let cardBg = isLight ? '#FFFFFF' : 'var(--bg-secondary)';
            let borderColor = isLight ? '#E2E8F0' : 'var(--border-primary)';
            let iconBg = isLight ? '#F1F5F9' : 'rgba(255,255,255,0.05)';
            let titleColor = isLight ? '#0F172A' : 'var(--text-primary)';
            let opacity = 1;

            if (isCompleted) {
              borderColor = '#E84393';
              iconBg = isLight ? '#FDF2F8' : 'rgba(232, 67, 147, 0.1)';
            } else if (isCurrent) {
              cardBg = isLight ? '#FFF1F8' : 'rgba(232, 67, 147, 0.05)';
              borderColor = '#E84393';
              iconBg = '#E84393';
            } else if (isLocked) {
              opacity = 0.6;
              cardBg = isLight ? '#F8FAFC' : 'rgba(0,0,0,0.2)';
            }

            return (
              <motion.div 
                key={mod.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleModuleClick(mod, index)}
                whileHover={!isLocked ? { scale: 1.02, x: 5 } : {}}
                whileTap={!isLocked ? { scale: 0.98 } : {}}
                className="card dsa-card-wrapper"
                style={{
                  background: cardBg,
                  border: `1px solid ${borderColor}`,
                  boxShadow: isCurrent 
                    ? (isLight ? '0 10px 25px rgba(232, 67, 147, 0.15)' : '0 10px 30px rgba(232, 67, 147, 0.1)') 
                    : (isLight ? '0 2px 10px rgba(0,0,0,0.02)' : 'var(--shadow-sm)'),
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  position: 'relative'
                }}
              >
                {/* Status Node */}
                <div 
                  className="dsa-status-node"
                  style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: isCompleted ? '#E84393' : isCurrent ? '#E84393' : (isLight ? '#E2E8F0' : '#334155'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '0.8rem', flexShrink: 0,
                  boxShadow: isCurrent ? '0 0 0 6px rgba(232, 67, 147, 0.2)' : 'none',
                  zIndex: 2
                }}>
                  {isCompleted ? '✓' : isLocked ? '🔒' : '●'}
                </div>

                {/* Module Icon */}
                <div className="dsa-icon-container" style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', flexShrink: 0
                }}>
                  {mod.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: titleColor, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {mod.title}
                      {isCurrent && (
                        <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem', background: '#E84393', color: 'white', borderRadius: '10px', fontWeight: 600 }}>
                          IN PROGRESS
                        </span>
                      )}
                      {isCompleted && (
                        <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--color-success, #10b981)', borderRadius: '10px', fontWeight: 600 }}>
                          COMPLETED
                        </span>
                      )}
                    </h3>
                    <span style={{ fontSize: '0.85rem', color: '#E84393', fontWeight: 600 }}>
                      {mod.xp} XP
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: isLight ? '#64748B' : 'var(--text-secondary)' }}>
                    {mod.desc}
                  </p>
                </div>
                
                {/* Action button */}
                {!isLocked && (
                  <div style={{ color: '#E84393', paddingRight: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>→</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
