import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { skillTreeService } from '../services';
import { useThemeStore } from '../features/theme/useThemeStore';

const TIER_COLORS_LIGHT = {
  1: '#6366F1', // Indigo
  2: '#3B82F6', // Blue
  3: '#0D9488', // Teal
  4: '#4F46E5', // Deep Indigo
  5: '#8B5CF6', // Purple
};

const TIER_COLORS_DARK = {
  1: '#818cf8',
  2: '#60a5fa',
  3: '#2dd4bf',
  4: '#a5b4fc',
  5: '#c084fc',
};

const getTierColor = (tier, isLight, fallbackColor) => {
  if (isLight) {
    return TIER_COLORS_LIGHT[tier] || fallbackColor || '#6366F1';
  }
  return fallbackColor || TIER_COLORS_DARK[tier] || '#818cf8';
};

export default function SkillTrees() {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  const [selectedTreeId, setSelectedTreeId] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'path';
    }
    return 'canvas';
  });
  const [zoom, setZoom] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 0.75;
    }
    return 1;
  });
  const [activeNodeModal, setActiveNodeModal] = useState(null);

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

  const handleEnterNode = (node) => {
    if (node.unlocked) {
      toast.success(`Entering ${node.title} arena...`);
      const searchTerm = node.title.replace(/[&]/g, '').trim();
      setTimeout(() => navigate(`/challenges?search=${encodeURIComponent(searchTerm)}&node=${node.nodeId}`), 400);
    } else {
      toast.error(`Node locked! Need ${node.xpRequired} XP to unlock.`);
    }
  };

  const handleZoomIn = () => setZoom(z => Math.min(1.5, Math.round((z + 0.15) * 100) / 100));
  const handleZoomOut = () => setZoom(z => Math.max(0.5, Math.round((z - 0.15) * 100) / 100));
  const handleResetZoom = () => setZoom(typeof window !== 'undefined' && window.innerWidth < 768 ? 0.75 : 1);

  if (loading) return <div className="page-container"><div className="skeleton" style={{ height: 400, borderRadius: 'var(--radius-lg)' }} /></div>;

  // Group nodes by tier for Learning Path view
  const tierGroups = (selected?.nodes || []).reduce((acc, node) => {
    const t = node.tier || 1;
    if (!acc[t]) acc[t] = [];
    acc[t].push(node);
    return acc;
  }, {});
  const sortedTiers = Object.keys(tierGroups).sort((a, b) => Number(a) - Number(b));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
      <div className="page-header" style={{ position: 'relative', zIndex: 10 }}>
        <h1 style={{ background: 'linear-gradient(135deg, var(--text-primary), var(--accent-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Skill Trees
        </h1>
        <p style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', color: 'var(--text-secondary)' }}>
          Visual learning paths to master different domains
        </p>
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
                  background: isLight ? '#FFFFFF' : 'var(--bg-secondary)',
                  border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255,255,255,0.05)',
                  boxShadow: isLight ? '0 4px 20px rgba(99, 102, 241, 0.08), 0 1px 3px rgba(0,0,0,0.04)' : `0 10px 30px rgba(0,0,0,0.2)`
                }} 
                onClick={() => setSelectedTreeId(tree._id)}
              >
                {/* Ambient Glow */}
                <div style={{
                  position: 'absolute', top: '-50%', right: '-20%', width: '150px', height: '150px',
                  background: tree.color, filter: 'blur(80px)', opacity: isLight ? 0.1 : 0.15, borderRadius: '50%', zIndex: 0
                }} />
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div className="skill-tree-hub-icon-row">
                    <div className="skill-tree-hub-icon" style={{
                      border: isLight ? `1px solid ${tree.color}35` : `1px solid ${tree.color}40`, 
                      boxShadow: isLight ? `0 2px 10px ${tree.color}15` : `inset 0 0 20px ${tree.color}20`,
                      background: isLight ? '#F8FAFC' : 'rgba(255,255,255,0.05)'
                    }}>
                      {tree.icon}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h3 className="skill-tree-hub-title" style={{ color: isLight ? '#0F172A' : 'var(--text-primary)' }}>{tree.name}</h3>
                      <p className="skill-tree-hub-desc" style={{ color: isLight ? '#64748B' : 'var(--text-secondary)' }}>{tree.description}</p>
                    </div>
                  </div>
                  
                  <div className="skill-tree-hub-footer">
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
                <div style={{ position: 'absolute', bottom: 0, left: 0, height: '3px', width: '100%', background: isLight ? '#E2E8F0' : 'rgba(255,255,255,0.05)' }}>
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
            {/* Top Navigation & View Switcher Bar */}
            <div className="skill-tree-topbar">
              <button 
                onClick={() => { setSelectedTreeId(null); setActiveNodeModal(null); }} 
                className="btn btn-ghost"
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.1rem', 
                  background: isLight ? '#FFFFFF' : 'var(--bg-secondary)', 
                  border: isLight ? '1px solid #CBD5E1' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 'var(--radius-full)',
                  color: isLight ? '#1E293B' : 'var(--text-primary)',
                  fontWeight: 600,
                  boxShadow: isLight ? '0 2px 6px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                ← Return to Hub
              </button>

              <div className="skill-tree-view-toggle">
                <button 
                  type="button"
                  className={`skill-tree-toggle-btn ${viewMode === 'path' ? 'active' : ''}`}
                  onClick={() => setViewMode('path')}
                >
                  <span>📋</span> Learning Path
                </button>
                <button 
                  type="button"
                  className={`skill-tree-toggle-btn ${viewMode === 'canvas' ? 'active' : ''}`}
                  onClick={() => setViewMode('canvas')}
                >
                  <span>🌳</span> 2D Canvas
                </button>
              </div>
            </div>

            {loadingDetail ? (
              <div className="skeleton" style={{ height: 600, borderRadius: 'var(--radius-lg)' }} />
            ) : selected && (
              <div className="card" style={{ 
                padding: 0, 
                overflow: 'hidden', 
                border: isLight ? '1px solid rgba(99, 102, 241, 0.2)' : `1px solid ${selected.color}30`, 
                boxShadow: isLight ? '0 10px 30px rgba(99, 102, 241, 0.08), 0 1px 3px rgba(0,0,0,0.04)' : `0 10px 30px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.05)`,
                background: isLight ? '#FFFFFF' : 'var(--bg-secondary)'
              }}>
                
                {/* Header Banner */}
                <div style={{ 
                  padding: 'clamp(1.25rem, 3vw, 2rem)', 
                  background: isLight 
                    ? 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 50%, #F5F3FF 100%)' 
                    : `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4)), ${selected.color}20`, 
                  position: 'relative' 
                }}>
                  <div className="skill-tree-header">
                    <motion.div 
                      initial={{ rotate: -180, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", stiffness: 100 }}
                      className="skill-tree-header-icon"
                      style={{ 
                        filter: isLight ? 'drop-shadow(0 4px 12px rgba(99, 102, 241, 0.2))' : `drop-shadow(0 0 10px ${selected.color}80)`,
                        background: isLight ? '#FFFFFF' : 'rgba(255,255,255,0.06)',
                        width: '76px',
                        height: '76px',
                        borderRadius: '20px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: isLight ? '1px solid rgba(99, 102, 241, 0.25)' : `1px solid ${selected.color}40`,
                        boxShadow: isLight ? '0 4px 14px rgba(99, 102, 241, 0.15), 0 1px 3px rgba(0,0,0,0.05)' : 'none',
                        fontSize: '3.2rem',
                        flexShrink: 0
                      }}
                    >
                      {selected.icon}
                    </motion.div>
                    <div>
                      <h2 className="skill-tree-header-title" style={{ 
                        color: isLight ? '#0F172A' : 'var(--text-primary)', 
                        fontWeight: 800,
                        textShadow: isLight ? 'none' : `0 0 10px ${selected.color}40`, 
                        wordBreak: 'break-word' 
                      }}>
                        {selected.name}
                      </h2>
                      <p className="skill-tree-header-desc" style={{ 
                        color: isLight ? '#64748B' : 'var(--text-secondary)', 
                        margin: 0 
                      }}>
                        {selected.description}
                      </p>
                    </div>
                  </div>
                  {/* Background Grid for header */}
                  <div style={{ 
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                    backgroundImage: isLight 
                      ? 'linear-gradient(rgba(99, 102, 241, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.08) 1px, transparent 1px)' 
                      : 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', 
                    backgroundSize: '20px 20px', 
                    zIndex: 0, 
                    opacity: isLight ? 0.7 : 0.5 
                  }} />
                </div>

                {/* View Mode 1: Learning Path View (Mobile-First & Clean Vertical Flow) */}
                {viewMode === 'path' ? (
                  <div className="skill-tree-path-container">
                    {sortedTiers.map(tier => {
                      const tierColor = getTierColor(Number(tier), isLight, selected.color);
                      return (
                        <div key={tier} className="skill-tree-tier-section">
                          <div className="skill-tree-tier-header">
                            <span className="skill-tree-tier-badge" style={{ 
                              background: isLight ? `${tierColor}18` : `${tierColor}25`, 
                              color: tierColor, 
                              border: `1px solid ${tierColor}45` 
                            }}>
                              Tier {tier}
                            </span>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: isLight ? '#0F172A' : 'var(--text-primary)', margin: 0 }}>
                              {tier === '1' ? 'Foundations & Basics' : tier === '2' ? 'Core Concepts' : tier === '3' ? 'Intermediate Patterns' : tier === '4' ? 'Advanced Architecture' : 'Expert Mastery'}
                            </h3>
                          </div>

                          <div className="skill-tree-tier-grid">
                            {tierGroups[tier].map((node) => {
                              const isCompleted = node.progress === 100;
                              const isUnlocked = node.unlocked;
                              const nodeTierColor = getTierColor(node.tier, isLight, selected.color);

                              return (
                                <motion.div
                                  key={node.nodeId}
                                  className={`skill-tree-node-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                                  style={{
                                    borderLeft: `4px solid ${isCompleted ? '#10B981' : isUnlocked ? nodeTierColor : (isLight ? '#CBD5E1' : 'rgba(255,255,255,0.1)')}`
                                  }}
                                >
                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                                        <span style={{ fontSize: '1.35rem', flexShrink: 0 }}>{isCompleted ? '✨' : isUnlocked ? '🔥' : '🔒'}</span>
                                        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: isLight ? '#0F172A' : 'var(--text-primary)', margin: 0, wordBreak: 'break-word' }}>
                                          {node.title}
                                        </h4>
                                      </div>
                                      <span style={{ 
                                        fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '100px', 
                                        background: isLight ? `${nodeTierColor}15` : 'rgba(255,255,255,0.06)', 
                                        color: isLight ? nodeTierColor : 'var(--text-tertiary)', 
                                        fontWeight: 700, flexShrink: 0 
                                      }}>
                                        Tier {node.tier}
                                      </span>
                                    </div>

                                    <p style={{ fontSize: '0.85rem', color: isLight ? '#475569' : 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                                      {node.description || 'Master this domain to advance your technical skills.'}
                                    </p>

                                    {/* Progress bar and challenges count */}
                                    <div style={{ marginBottom: '0.5rem' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: isLight ? '#64748B' : 'var(--text-tertiary)', fontWeight: 600, marginBottom: '0.35rem' }}>
                                        <span>Progress</span>
                                        <span style={{ color: isCompleted ? '#10B981' : isUnlocked ? nodeTierColor : 'inherit' }}>
                                          {node.completed || 0} / {node.total || 0} ({node.progress || 0}%)
                                        </span>
                                      </div>
                                      <div style={{ width: '100%', height: '6px', background: isLight ? '#E2E8F0' : 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                                        <div style={{ width: `${node.progress || 0}%`, height: '100%', background: isCompleted ? '#10B981' : nodeTierColor, borderRadius: '999px', transition: 'width 0.4s ease' }} />
                                      </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: isLight ? '#64748B' : 'var(--text-tertiary)', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255,255,255,0.06)' }}>
                                      <span>Required XP</span>
                                      <span style={{ fontWeight: 700, color: isUnlocked ? (isLight ? '#0F172A' : 'var(--text-primary)') : nodeTierColor }}>
                                        {node.xpRequired ? `${node.xpRequired} XP` : '0 XP (Free)'}
                                      </span>
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleEnterNode(node)}
                                    disabled={!isUnlocked}
                                    className={`btn ${isUnlocked ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                                    style={{
                                      width: '100%',
                                      minHeight: '38px',
                                      justifyContent: 'center',
                                      opacity: isUnlocked ? 1 : 0.75,
                                      cursor: isUnlocked ? 'pointer' : 'not-allowed',
                                      background: isUnlocked ? (isCompleted ? '#10B981' : nodeTierColor) : (isLight ? '#F1F5F9' : 'var(--bg-tertiary)'),
                                      borderColor: isUnlocked ? 'transparent' : (isLight ? '#CBD5E1' : 'var(--border-primary)'),
                                      color: isUnlocked ? '#fff' : (isLight ? '#64748B' : 'var(--text-tertiary)'),
                                      fontWeight: 700,
                                      marginTop: '0.5rem',
                                      boxShadow: isUnlocked ? `0 4px 12px ${nodeTierColor}35` : 'none'
                                    }}
                                  >
                                    {isCompleted ? 'Review Arena ▶' : isUnlocked ? 'Enter Arena ▶' : `🔒 Locked (${node.xpRequired} XP)`}
                                  </button>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* View Mode 2: Interactive 2D Canvas with Pan & Zoom */
                  <div style={{ position: 'relative' }}>
                    {/* Zoom controls */}
                    <div className="skill-tree-zoom-controls">
                      <button type="button" className="skill-tree-zoom-btn" onClick={handleZoomOut} title="Zoom Out" aria-label="Zoom Out">−</button>
                      <span className="skill-tree-zoom-label">{Math.round(zoom * 100)}%</span>
                      <button type="button" className="skill-tree-zoom-btn" onClick={handleZoomIn} title="Zoom In" aria-label="Zoom In">+</button>
                      <button type="button" className="skill-tree-zoom-btn" onClick={handleResetZoom} title="Reset Zoom" aria-label="Reset Zoom" style={{ fontSize: '0.9rem' }}>⟲</button>
                    </div>

                    <div className="skill-tree-canvas-hint">
                      👆 Drag to pan canvas • Use buttons to zoom
                    </div>

                    <div className="skill-tree-canvas-viewport">
                      <motion.div 
                        drag
                        dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
                        animate={{ scale: zoom }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          position: 'absolute', 
                          top: 0, 
                          left: 0,
                          transformOrigin: '250px 250px'
                        }}
                      >
                      
                        {/* Connection lines */}
                        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
                          {selected.nodes?.map(node => node.connections?.map(connId => {
                            const target = selected.nodes.find(n => n.nodeId === connId);
                            if (!target) return null;
                            
                            const isUnlockedPath = node.unlocked && target.unlocked;
                            const pathTierColor = getTierColor(node.tier, isLight, selected.color);
                            
                            return (
                              <g key={`${node.nodeId}-${connId}`}>
                                {/* Base Line */}
                                <line 
                                  x1={node.position.x + 60} y1={node.position.y + 40}
                                  x2={target.position.x + 60} y2={target.position.y + 40}
                                  stroke={isUnlockedPath ? pathTierColor : (isLight ? '#94A3B8' : 'rgba(255,255,255,0.12)')} 
                                  strokeWidth={isUnlockedPath ? "3.5" : "2.5"} 
                                  strokeDasharray={!isUnlockedPath && isLight ? "6 6" : "none"}
                                  strokeOpacity={isUnlockedPath ? "0.9" : (isLight ? "0.85" : "0.6")} 
                                  style={isUnlockedPath ? { filter: `drop-shadow(0 0 4px ${isLight ? 'rgba(99, 102, 241, 0.4)' : pathTierColor})` } : undefined}
                                />
                                {/* Animated Energy Flow */}
                                {isUnlockedPath && (
                                  <motion.line 
                                    x1={node.position.x + 60} y1={node.position.y + 40}
                                    x2={target.position.x + 60} y2={target.position.y + 40}
                                    stroke={isLight ? '#FFFFFF' : 'var(--text-primary)'} 
                                    strokeWidth="2.5" 
                                    strokeDasharray="6 14"
                                    animate={{ strokeDashoffset: [20, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                                    style={{ filter: `drop-shadow(0 0 3px ${isLight ? pathTierColor : pathTierColor + '80'})` }}
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
                          const tierColor = getTierColor(node.tier, isLight, selected.color);
                          
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
                                if (typeof window !== 'undefined' && window.innerWidth < 768) {
                                  setActiveNodeModal(node);
                                } else {
                                  handleEnterNode(node);
                                }
                              }}
                            >
                              
                              {/* Node Icon/Progress Container */}
                              <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 0.75rem' }}>
                                {/* Background Pulse Glow for Unlocked Node */}
                                {isUnlocked && !isCompleted && (
                                  <motion.div
                                    animate={{ scale: [1, 1.18, 1], opacity: isLight ? [0.25, 0.05, 0.25] : [0.2, 0.02, 0.2] }}
                                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                                    style={{ 
                                      position: 'absolute', inset: -6, 
                                      background: tierColor, 
                                      borderRadius: '50%', 
                                      filter: isLight ? 'blur(10px)' : 'blur(8px)', 
                                      zIndex: 0 
                                    }}
                                  />
                                )}

                                {/* Active-state Rotating Dashed Ring for Active Unlocked Node */}
                                {isUnlocked && !isCompleted && (
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                                    style={{
                                      position: 'absolute',
                                      inset: -5,
                                      borderRadius: '50%',
                                      border: `2px dashed ${tierColor}`,
                                      opacity: isLight ? 0.75 : 0.5,
                                      zIndex: 1,
                                      pointerEvents: 'none'
                                    }}
                                  />
                                )}
                                
                                {/* Circular Progress Ring */}
                                <svg width="80" height="80" viewBox="0 0 80 80" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)', zIndex: 2 }}>
                                  <circle 
                                    cx="40" cy="40" r="36" 
                                    fill="none" 
                                    stroke={isLight ? (isUnlocked ? '#E0E7FF' : '#CBD5E1') : 'rgba(255,255,255,0.08)'} 
                                    strokeWidth="6" 
                                  />
                                  <motion.circle 
                                    cx="40" cy="40" r="36" 
                                    fill="none" 
                                    stroke={isCompleted ? '#10B981' : tierColor} 
                                    strokeWidth="6" 
                                    strokeLinecap="round"
                                    strokeDasharray={2 * Math.PI * 36}
                                    initial={{ strokeDashoffset: 2 * Math.PI * 36 }}
                                    animate={{ strokeDashoffset: 2 * Math.PI * 36 * (1 - (node.progress || 0) / 100) }}
                                    transition={{ duration: 1.5, delay: i * 0.1 + 0.5, ease: "easeOut" }}
                                    style={{ filter: isLight ? `drop-shadow(0 0 3px ${tierColor}60)` : `drop-shadow(0 0 2px ${tierColor}80)` }}
                                  />
                                </svg>

                                {/* Node Core */}
                                <div style={{
                                  position: 'absolute', top: 6, left: 6, width: 68, height: 68, borderRadius: '50%',
                                  background: isCompleted 
                                    ? (isLight ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : tierColor) 
                                    : isUnlocked 
                                      ? (isLight ? 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)' : 'var(--bg-elevated)') 
                                      : (isLight ? '#F1F5F9' : 'var(--bg-secondary)'),
                                  border: isCompleted 
                                    ? (isLight ? '2px solid #059669' : 'var(--text-primary)') 
                                    : isUnlocked 
                                      ? `2px solid ${tierColor}` 
                                      : (isLight ? '2px solid #CBD5E1' : 'rgba(255,255,255,0.1)'),
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  boxShadow: isCompleted 
                                    ? (isLight ? '0 0 16px rgba(16, 185, 129, 0.4), inset 0 1px 2px rgba(255,255,255,0.5)' : `0 0 10px ${tierColor}80, inset 0 0 10px rgba(255,255,255,0.3)`) 
                                    : isUnlocked
                                      ? (isLight ? '0 4px 14px rgba(99, 102, 241, 0.2), inset 0 1px 2px rgba(255,255,255,0.8)' : 'inset 0 2px 5px rgba(0,0,0,0.5)')
                                      : (isLight ? 'inset 0 2px 4px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)' : 'inset 0 2px 5px rgba(0,0,0,0.5)'),
                                  zIndex: 3, overflow: 'hidden'
                                }}>
                                  {/* Inner Shine */}
                                  {isCompleted && (
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(rgba(255,255,255,0.45), transparent)', borderRadius: '50% 50% 0 0' }} />
                                  )}
                                  <span style={{ 
                                    fontSize: '1.5rem', 
                                    position: 'relative', 
                                    zIndex: 4, 
                                    filter: !isUnlocked ? (isLight ? 'grayscale(30%) opacity(75%)' : 'grayscale(100%) opacity(50%)') : 'none' 
                                  }}>
                                    {isCompleted ? '✨' : isUnlocked ? '🔥' : '🔒'}
                                  </span>
                                </div>
                              </div>

                              {/* Node Text */}
                              <motion.div animate={{ y: hoveredNode === node.nodeId ? -5 : 0 }}>
                                <p style={{ 
                                  fontSize: '0.85rem', fontWeight: 800, 
                                  color: isUnlocked ? (isLight ? '#1E293B' : 'var(--text-primary)') : (isLight ? '#64748B' : 'var(--text-tertiary)'),
                                  textShadow: isUnlocked ? (isLight ? '0 1px 2px rgba(255,255,255,0.8)' : '0 2px 4px rgba(0,0,0,0.5)') : 'none',
                                  lineHeight: 1.25
                                }}>
                                  {node.title}
                                </p>
                                <p style={{ 
                                  fontSize: '0.7rem', 
                                  color: isUnlocked ? tierColor : (isLight ? '#64748B' : 'var(--text-tertiary)'), 
                                  fontWeight: 700, 
                                  marginTop: '4px', 
                                  textTransform: 'uppercase', 
                                  letterSpacing: '1px'
                                }}>
                                  Tier {node.tier}
                                </p>
                              </motion.div>

                              {/* Floating Tooltip (Desktop) */}
                              <AnimatePresence>
                                {hoveredNode === node.nodeId && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                    style={{
                                      position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '1rem',
                                      width: '230px', 
                                      background: isLight ? '#FFFFFF' : 'rgba(15, 15, 20, 0.95)', 
                                      backdropFilter: 'blur(10px)',
                                      border: isLight ? '1px solid rgba(99, 102, 241, 0.25)' : `1px solid ${tierColor}40`, 
                                      borderRadius: '14px', 
                                      padding: '1.1rem',
                                      boxShadow: isLight 
                                        ? '0 12px 30px rgba(99, 102, 241, 0.15), 0 4px 10px rgba(0,0,0,0.06)' 
                                        : `0 10px 20px rgba(0,0,0,0.3), 0 0 10px ${tierColor}10`,
                                      pointerEvents: 'none', zIndex: 100
                                    }}
                                  >
                                    <div style={{ fontSize: '0.8rem', color: isLight ? '#475569' : 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                                      {node.description || 'Master this node to unlock advanced abilities.'}
                                    </div>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', marginBottom: '0.5rem' }}>
                                      <span style={{ color: isLight ? '#64748B' : 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Challenges</span>
                                      <span style={{ color: isLight ? '#0F172A' : 'var(--text-primary)', fontWeight: 700 }}>{node.completed || 0} / {node.total || 0}</span>
                                    </div>

                                    {/* Mini progress bar */}
                                    <div style={{ width: '100%', height: '5px', background: isLight ? '#E2E8F0' : 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                                      <div style={{ width: `${node.progress || 0}%`, height: '100%', background: isCompleted ? '#10B981' : tierColor, borderRadius: '4px', transition: 'width 0.5s ease' }} />
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: isLight ? '1px solid #E2E8F0' : '1px solid var(--border-primary)', paddingTop: '0.5rem' }}>
                                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: isLight ? '#64748B' : 'var(--text-tertiary)', textTransform: 'uppercase' }}>XP Required</span>
                                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: tierColor }}>{node.xpRequired ? `${node.xpRequired} XP` : '0 XP (Free)'}</span>
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
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Node Modal for Mobile/Touch Interaction on Canvas */}
      <AnimatePresence>
        {activeNodeModal && (
          <div className="skill-tree-modal-backdrop" onClick={() => setActiveNodeModal(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="skill-tree-modal-box"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setActiveNodeModal(null)}
                style={{ 
                  position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', 
                  color: isLight ? '#64748B' : 'var(--text-tertiary)', 
                  fontSize: '1.25rem', cursor: 'pointer', lineHeight: 1 
                }}
                aria-label="Close details"
              >
                ✕
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>
                  {activeNodeModal.progress === 100 ? '✨' : activeNodeModal.unlocked ? '🔥' : '🔒'}
                </span>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: isLight ? '#0F172A' : 'var(--text-primary)', margin: 0, wordBreak: 'break-word' }}>
                    {activeNodeModal.title}
                  </h3>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: getTierColor(activeNodeModal.tier, isLight, selected?.color), 
                    fontWeight: 700, 
                    textTransform: 'uppercase' 
                  }}>
                    Tier {activeNodeModal.tier}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', color: isLight ? '#475569' : 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                {activeNodeModal.description || 'Master this node to unlock advanced abilities and earn XP.'}
              </p>

              <div style={{ 
                background: isLight ? '#F8FAFC' : 'var(--bg-tertiary)', 
                border: isLight ? '1px solid #E2E8F0' : '1px solid var(--border-primary)', 
                borderRadius: '12px', 
                padding: '1rem', 
                marginBottom: '1.25rem' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: isLight ? '#64748B' : 'var(--text-tertiary)', fontWeight: 600, marginBottom: '0.5rem' }}>
                  <span>Challenges Completed</span>
                  <span style={{ color: isLight ? '#0F172A' : 'var(--text-primary)', fontWeight: 700 }}>{activeNodeModal.completed || 0} / {activeNodeModal.total || 0}</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: isLight ? '#E2E8F0' : 'var(--bg-elevated)', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                  <div style={{ width: `${activeNodeModal.progress || 0}%`, height: '100%', background: activeNodeModal.progress === 100 ? '#10B981' : getTierColor(activeNodeModal.tier, isLight, selected?.color), borderRadius: '999px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: isLight ? '#64748B' : 'var(--text-tertiary)' }}>
                  <span>Requirement</span>
                  <span style={{ fontWeight: 700, color: activeNodeModal.unlocked ? (isLight ? '#0F172A' : 'var(--text-primary)') : getTierColor(activeNodeModal.tier, isLight, selected?.color) }}>
                    {activeNodeModal.xpRequired ? `${activeNodeModal.xpRequired} XP` : '0 XP (Free)'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const node = activeNodeModal;
                  setActiveNodeModal(null);
                  handleEnterNode(node);
                }}
                disabled={!activeNodeModal.unlocked}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  minHeight: '44px',
                  justifyContent: 'center',
                  background: activeNodeModal.unlocked 
                    ? (activeNodeModal.progress === 100 ? '#10B981' : getTierColor(activeNodeModal.tier, isLight, selected?.color)) 
                    : (isLight ? '#F1F5F9' : 'rgba(255,255,255,0.05)'),
                  color: activeNodeModal.unlocked ? '#FFFFFF' : (isLight ? '#64748B' : 'var(--text-tertiary)'),
                  border: activeNodeModal.unlocked ? 'none' : (isLight ? '1px solid #CBD5E1' : 'none'),
                  opacity: activeNodeModal.unlocked ? 1 : 0.8,
                  cursor: activeNodeModal.unlocked ? 'pointer' : 'not-allowed',
                  fontWeight: 700,
                  boxShadow: activeNodeModal.unlocked ? '0 4px 14px rgba(99, 102, 241, 0.25)' : 'none'
                }}
              >
                {activeNodeModal.unlocked ? 'Enter Arena ▶' : `🔒 Locked (${activeNodeModal.xpRequired} XP required)`}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
