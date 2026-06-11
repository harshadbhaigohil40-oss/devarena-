import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { skillTreeService } from '../services';

export default function SkillTrees() {
  const navigate = useNavigate();
  const [selectedTreeId, setSelectedTreeId] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  const { data: trees = [], isLoading: loadingTrees } = useQuery({
    queryKey: ['skillTrees'],
    queryFn: async () => {
      const r = await skillTreeService.list();
      return r.data.data.skillTrees;
    }
  });

  const { data: selected = null, isLoading: loadingDetail } = useQuery({
    queryKey: ['skillTree', selectedTreeId],
    queryFn: async () => {
      const r = await skillTreeService.get(selectedTreeId);
      return r.data.data.skillTree;
    },
    enabled: !!selectedTreeId
  });

  const loading = loadingTrees;

  if (loading) return <div className="page-container"><div className="skeleton" style={{ height: 400 }} /></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
      <div className="page-header" style={{ position: 'relative', zIndex: 10 }}>
        <h1 style={{ background: 'linear-gradient(135deg, var(--text-primary), var(--accent-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Skill Trees
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Visual learning paths to master different domains</p>
      </div>

      <AnimatePresence mode="wait">
        {!selectedTreeId ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-2"
          >
            {trees.map((tree, i) => (
              <motion.div key={tree._id} 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="card" 
                style={{ 
                  cursor: 'pointer', 
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'var(--bg-secondary)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  boxShadow: `0 10px 30px rgba(0,0,0,0.2)`
                }} 
                onClick={() => setSelectedTreeId(tree._id)}
              >
                {/* Ambient Glow */}
                <div style={{
                  position: 'absolute', top: '-50%', right: '-20%', width: '150px', height: '150px',
                  background: tree.color, filter: 'blur(80px)', opacity: 0.15, borderRadius: '50%', zIndex: 0
                }} />
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div className="flex items-center gap-md mb-md">
                    <div style={{ 
                      width: '64px', height: '64px', borderRadius: '16px', background: `rgba(255,255,255,0.05)`, 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
                      border: `1px solid ${tree.color}40`, boxShadow: `inset 0 0 20px ${tree.color}20`
                    }}>
                      {tree.icon}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.4rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{tree.name}</h3>
                      <p className="text-muted text-sm">{tree.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-lg">
                    <span className="badge" style={{ background: `${tree.color}20`, color: tree.color, border: `1px solid ${tree.color}40` }}>
                      {tree.progress || 0}% Mastered
                    </span>
                    <motion.div 
                      className="flex items-center gap-xs text-sm"
                      style={{ color: tree.color, fontWeight: 600 }}
                      whileHover={{ x: 5 }}
                    >
                      Enter Tree <span style={{ fontSize: '1.2rem' }}>→</span>
                    </motion.div>
                  </div>
                </div>
                
                {/* Actual Progress Bar under card */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, height: '3px', width: '100%', background: 'rgba(255,255,255,0.05)' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${tree.progress || 0}%` }} 
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{ height: '100%', background: tree.color, boxShadow: `0 0 10px ${tree.color}` }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="detail"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-lg">
              <button 
                onClick={() => setSelectedTreeId(null)} 
                className="btn btn-ghost"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)' }}
              >
                ← Return to Hub
              </button>
            </div>

            {loadingDetail ? (
              <div className="skeleton" style={{ height: 600, borderRadius: 'var(--radius-lg)' }} />
            ) : selected && (
              <div className="card" style={{ padding: 0, overflow: 'hidden', border: `1px solid ${selected.color}30`, boxShadow: `0 10px 30px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.05)` }}>
                
                {/* Header */}
                <div style={{ padding: '2rem', background: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4)), ${selected.color}20`, position: 'relative' }}>
                  <div className="flex items-center gap-lg position-relative z-10">
                    <motion.div 
                      initial={{ rotate: -180, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", stiffness: 100 }}
                      style={{ fontSize: '3.5rem', filter: `drop-shadow(0 0 10px ${selected.color}80)` }}
                    >
                      {selected.icon}
                    </motion.div>
                    <div>
                      <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)', textShadow: `0 0 10px ${selected.color}40` }}>{selected.name}</h2>
                      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', maxWidth: '600px' }}>{selected.description}</p>
                    </div>
                  </div>
                  {/* Background Grid for header */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px', zIndex: 0, opacity: 0.5 }} />
                </div>

                {/* Skill Tree Visualization Area */}
                <div style={{ 
                  position: 'relative', 
                  minHeight: '600px', 
                  background: 'radial-gradient(circle at center, var(--bg-secondary) 0%, var(--bg-primary) 100%)', 
                  overflow: 'hidden',
                  cursor: 'grab'
                }}>
                  <motion.div 
                    drag
                    dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
                    style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                  >
                  
                  {/* Connection lines */}
                  <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
                    {selected.nodes?.map(node => node.connections?.map(connId => {
                      const target = selected.nodes.find(n => n.nodeId === connId);
                    if (!target) return null;
                    
                    const isUnlockedPath = node.unlocked && target.unlocked;
                    
                    return (
                      <g key={`${node.nodeId}-${connId}`}>
                        {/* Base Line */}
                        <line 
                          x1={node.position.x + 60} y1={node.position.y + 40}
                          x2={target.position.x + 60} y2={target.position.y + 40}
                          stroke={isUnlockedPath ? selected.color : 'rgba(255,255,255,0.1)'} 
                          strokeWidth={isUnlockedPath ? "3" : "2"} 
                          strokeOpacity={isUnlockedPath ? "0.6" : "1"} 
                        />
                        {/* Animated Energy Flow */}
                        {isUnlockedPath && (
                          <motion.line 
                            x1={node.position.x + 60} y1={node.position.y + 40}
                            x2={target.position.x + 60} y2={target.position.y + 40}
                            stroke="var(--text-primary)" 
                            strokeWidth="2" 
                            strokeDasharray="5 15"
                            animate={{ strokeDashoffset: [20, 0] }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            style={{ filter: `drop-shadow(0 0 3px ${selected.color}80)` }}
                          />
                        )}
                      </g>
                    );
                  }))}
                </svg>

                  {/* Nodes */}
                  {selected?.nodes?.map((node, i) => {
                    const isCompleted = node.progress === 100;
                    const isUnlocked = node.unlocked;
                    
                    return (
                      <motion.div key={node.nodeId}
                        initial={{ opacity: 0, scale: 0, y: 20 }} 
                        animate={{ opacity: 1, scale: 1, y: 0 }} 
                        transition={{ delay: i * 0.1 + 0.3, type: "spring", stiffness: 120 }}
                        whileHover={{ scale: 1.1, zIndex: 50 }}
                        onHoverStart={() => setHoveredNode(node.nodeId)}
                        onHoverEnd={() => setHoveredNode(null)}
                        style={{
                          position: 'absolute', left: node.position.x, top: node.position.y,
                          width: 120, textAlign: 'center', cursor: isUnlocked ? 'pointer' : 'not-allowed',
                          zIndex: hoveredNode === node.nodeId ? 50 : 10
                        }}
                        onClick={() => {
                          if (isUnlocked) {
                            import('react-hot-toast').then(module => module.toast.success(`Entering ${node.title} arena...`));
                            setTimeout(() => navigate('/challenges'), 500);
                          } else {
                            import('react-hot-toast').then(module => module.toast.error(`Node locked! Complete previous challenges first.`));
                          }
                        }}
                      >
                        
                        {/* Node Icon/Progress Container */}
                        <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 0.75rem' }}>
                          {/* Background Pulse if unlocked but not complete */}
                          {isUnlocked && !isCompleted && (
                            <motion.div
                              animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0, 0.15] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              style={{ position: 'absolute', inset: -5, background: selected.color, borderRadius: '50%', filter: 'blur(8px)', zIndex: 0 }}
                            />
                          )}
                          
                          {/* Circular Progress Ring */}
                          <svg width="80" height="80" viewBox="0 0 80 80" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)', zIndex: 1 }}>
                            <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                            <motion.circle cx="40" cy="40" r="36" fill="none" stroke={selected.color} strokeWidth="6" strokeLinecap="round"
                              strokeDasharray={2 * Math.PI * 36}
                              initial={{ strokeDashoffset: 2 * Math.PI * 36 }}
                              animate={{ strokeDashoffset: 2 * Math.PI * 36 * (1 - (node.progress || 0) / 100) }}
                              transition={{ duration: 1.5, delay: i * 0.1 + 0.5, ease: "easeOut" }}
                              style={{ filter: `drop-shadow(0 0 2px ${selected.color}80)` }}
                            />
                          </svg>

                          {/* Node Core */}
                          <div style={{
                            position: 'absolute', top: 6, left: 6, width: 68, height: 68, borderRadius: '50%',
                            background: isCompleted ? selected.color : isUnlocked ? 'var(--bg-elevated)' : 'var(--bg-secondary)',
                            border: `2px solid ${isCompleted ? 'var(--text-primary)' : isUnlocked ? selected.color : 'rgba(255,255,255,0.1)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: isCompleted ? `0 0 10px ${selected.color}80, inset 0 0 10px rgba(255,255,255,0.3)` : 'inset 0 2px 5px rgba(0,0,0,0.5)',
                            zIndex: 2, overflow: 'hidden'
                          }}>
                            {/* Inner Shine */}
                            {isCompleted && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(rgba(255,255,255,0.4), transparent)', borderRadius: '50% 50% 0 0' }} />}
                            <span style={{ fontSize: '1.5rem', position: 'relative', zIndex: 3, filter: !isUnlocked ? 'grayscale(100%) opacity(50%)' : 'none' }}>
                              {isCompleted ? '✨' : isUnlocked ? '🔥' : '🔒'}
                            </span>
                          </div>
                        </div>

                        {/* Node Text */}
                        <motion.div animate={{ y: hoveredNode === node.nodeId ? -5 : 0 }}>
                          <p style={{ 
                            fontSize: '0.85rem', fontWeight: 800, 
                            color: isUnlocked ? 'var(--text-primary)' : 'var(--text-tertiary)',
                            textShadow: isUnlocked ? '0 2px 4px rgba(0,0,0,0.5)' : 'none',
                            lineHeight: 1.2
                          }}>
                            {node.title}
                          </p>
                          <p style={{ 
                            fontSize: '0.7rem', color: isUnlocked ? selected.color : 'var(--text-tertiary)', 
                            fontWeight: 600, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px'
                          }}>
                            Tier {node.tier}
                          </p>
                        </motion.div>

                        {/* Floating Tooltip */}
                        <AnimatePresence>
                          {hoveredNode === node.nodeId && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                              style={{
                                position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '1rem',
                                width: '200px', background: 'rgba(15, 15, 20, 0.95)', backdropFilter: 'blur(10px)',
                                border: `1px solid ${selected.color}40`, borderRadius: '12px', padding: '1rem',
                                boxShadow: `0 10px 20px rgba(0,0,0,0.3), 0 0 10px ${selected.color}10`,
                                pointerEvents: 'none', zIndex: 100
                              }}
                            >
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{node.description || 'Master this node to unlock advanced abilities.'}</div>
                              <div className="flex justify-between items-center" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-primary)' }}>PROGRESS</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: selected.color }}>{node.progress || 0}%</span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                      </motion.div>
                    );
                  })}
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
