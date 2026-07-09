import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing systems');

  useEffect(() => {
    const steps = [
      { at: 15, text: 'Connecting to servers' },
      { at: 35, text: 'Loading challenge data' },
      { at: 55, text: 'Building skill trees' },
      { at: 75, text: 'Preparing dashboard' },
      { at: 90, text: 'Waking up backend server (may take ~15s)' },
    ];

    const interval = setInterval(() => {
      setProgress(prev => {
        // Asymptote towards 99% so it doesn't get stuck at 100%
        const next = prev + (99 - prev) * 0.08 + Math.random() * 1;
        
        const step = steps.find(s => prev < s.at && next >= s.at);
        if (step) setStatusText(step.text);
        
        // If it's been loading for a while and stuck near 99, update text
        if (next > 95 && prev > 95) {
          setStatusText('Waking up backend server (Render free tier)...');
        }
        
        return next > 99 ? 99 : next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        width: '100vw',
        background: '#050508',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        overflow: 'hidden'
      }}
    >
      
      {/* Subtle grid pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(circle at center, black 30%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 70%)',
        zIndex: 1
      }} />

      {/* Ambient glow - purple */}
      <motion.div
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.06, 0.15, 0.06],
        }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, #8a2be2 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          zIndex: 0,
          top: '30%',
          left: '35%',
        }}
      />

      {/* Ambient glow - cyan */}
      <motion.div
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.04, 0.1, 0.04],
        }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, #00e5ff 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          zIndex: 0,
          top: '40%',
          right: '30%',
        }}
      />

      {/* Central content */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Logo with rings */}
        <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          
          {/* Outer ring */}
          <motion.svg
            width="160" height="160" viewBox="0 0 160 160"
            style={{ position: 'absolute' }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          >
            <circle cx="80" cy="80" r="76" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <motion.circle 
              cx="80" cy="80" r="76" fill="none" 
              stroke="url(#loaderGrad1)" strokeWidth="2" 
              strokeDasharray="80 398" strokeLinecap="round"
              animate={{ strokeDashoffset: [0, -478] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="loaderGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8a2be2" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </motion.svg>

          {/* Inner ring */}
          <motion.svg
            width="120" height="120" viewBox="0 0 120 120"
            style={{ position: 'absolute' }}
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 7, ease: "linear" }}
          >
            <circle cx="60" cy="60" r="56" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <motion.circle 
              cx="60" cy="60" r="56" fill="none" 
              stroke="url(#loaderGrad2)" strokeWidth="2" 
              strokeDasharray="50 302" strokeLinecap="round"
              animate={{ strokeDashoffset: [0, 352] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="loaderGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00e5ff" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </motion.svg>

          {/* Center logo */}
          <motion.div
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(138, 43, 226, 0.2)',
                '0 0 40px rgba(138, 43, 226, 0.4)',
                '0 0 20px rgba(138, 43, 226, 0.2)'
              ],
              scale: [1, 1.03, 1]
            }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            style={{
              width: '72px',
              height: '72px',
              background: 'rgba(15, 15, 20, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Shimmer */}
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", repeatDelay: 2 }}
              style={{
                position: 'absolute', top: 0, left: 0, width: '40%', height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                transform: 'skewX(-20deg)'
              }}
            />
            <span style={{
              background: 'linear-gradient(135deg, #fff, #00e5ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 900,
              fontSize: '1.6rem',
              letterSpacing: '-1px',
              fontFamily: "'Inter', sans-serif"
            }}>
              DA
            </span>
          </motion.div>
        </div>

        {/* Brand name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ marginTop: '2.5rem', textAlign: 'center' }}
        >
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#fff',
            marginBottom: '0.25rem',
            fontFamily: "'Inter', sans-serif"
          }}>
            Dev<span style={{ color: '#8a2be2' }}>Arena</span>
          </div>
          <div style={{
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}>
            Engineering Excellence Platform
          </div>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ marginTop: '2.5rem', width: '280px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <motion.span
              key={statusText}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 0.5, y: 0 }}
              style={{
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              {statusText}
            </motion.span>
            <span style={{
              fontSize: '0.7rem',
              color: 'rgba(138, 43, 226, 0.8)',
              fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {Math.round(progress)}%
            </span>
          </div>

          {/* Track */}
          <div style={{
            width: '100%',
            height: '3px',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: '4px',
            overflow: 'hidden',
            position: 'relative',
          }}>
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #8a2be2, #00e5ff)',
                borderRadius: '4px',
                boxShadow: '0 0 12px rgba(138, 43, 226, 0.5)',
                width: `${progress}%`,
              }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
