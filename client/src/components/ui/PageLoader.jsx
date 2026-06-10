import { motion } from 'framer-motion';

export default function PageLoader() {
  return (
    <motion.div 
      initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
      exit={{ opacity: 0, backdropFilter: 'blur(0px)', scale: 1.1 }}
      transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
      style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        width: '100vw',
        background: 'radial-gradient(circle at center, rgba(15, 15, 20, 0.95) 0%, rgba(5, 5, 8, 1) 100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        overflow: 'hidden'
      }}
    >
      
      {/* Background Ambient Glows */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1],
          rotate: [0, 90, 0]
        }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 60%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          opacity: 0.15,
          zIndex: 0,
          mixBlendMode: 'screen'
        }}
      />

      <motion.div
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1],
          rotate: [0, -90, 0]
        }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: 2 }}
        style={{
          position: 'absolute',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, var(--accent-secondary) 0%, transparent 60%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          opacity: 0.1,
          zIndex: 0,
          mixBlendMode: 'screen'
        }}
      />

      {/* Grid Pattern Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(circle at center, black 20%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(circle at center, black 20%, transparent 80%)',
        zIndex: 1
      }} />

      {/* Central Interactive Element */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Core Ring Structure */}
        <div style={{ position: 'relative', width: '140px', height: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          
          {/* Outer Rotating Ring */}
          <motion.svg
            width="140"
            height="140"
            viewBox="0 0 140 140"
            style={{ position: 'absolute' }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          >
            <circle cx="70" cy="70" r="68" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <motion.circle 
              cx="70" cy="70" r="68" 
              fill="none" 
              stroke="url(#gradientPrimary)" 
              strokeWidth="2" 
              strokeDasharray="100 327"
              strokeLinecap="round"
              animate={{
                strokeDashoffset: [0, -427]
              }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="gradientPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-primary)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </motion.svg>

          {/* Inner Counter-Rotating Ring */}
          <motion.svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            style={{ position: 'absolute' }}
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          >
            <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <motion.circle 
              cx="50" cy="50" r="48" 
              fill="none" 
              stroke="url(#gradientSecondary)" 
              strokeWidth="2" 
              strokeDasharray="60 241"
              strokeLinecap="round"
              animate={{
                strokeDashoffset: [0, 301]
              }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="gradientSecondary" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-secondary)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </motion.svg>

          {/* Center Pulsing Logo */}
          <motion.div
            animate={{ 
              boxShadow: [
                '0 0 20px var(--accent-primary-glow)',
                '0 0 40px var(--accent-primary)',
                '0 0 20px var(--accent-primary-glow)'
              ],
              scale: [1, 1.05, 1]
            }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            style={{
              width: '64px',
              height: '64px',
              background: 'rgba(20, 20, 25, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Shimmer Effect */}
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", repeatDelay: 1 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '50%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transform: 'skewX(-20deg)'
              }}
            />
            
            <span style={{
              background: 'linear-gradient(135deg, #fff, var(--accent-secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 900,
              fontSize: '1.5rem',
              letterSpacing: '-0.5px'
            }}>
              DA
            </span>
          </motion.div>
        </div>

        {/* Loading Text */}
        <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{
              color: 'rgba(255,255,255,0.9)',
              letterSpacing: '0.3em',
              fontSize: '0.85rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              textShadow: '0 0 10px rgba(255,255,255,0.3)'
            }}>
              Initializing
            </span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              style={{ 
                color: 'var(--accent-primary)', 
                fontWeight: 'bold',
                textShadow: '0 0 10px var(--accent-primary-glow)' 
              }}
            >
              ...
            </motion.span>
          </motion.div>

          {/* Minimalist Progress Line */}
          <div style={{
            width: '200px',
            height: '2px',
            background: 'rgba(255,255,255,0.05)',
            marginTop: '1.5rem',
            borderRadius: '2px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <motion.div
              initial={{ scaleX: 0, transformOrigin: 'left' }}
              animate={{ scaleX: [0, 0.5, 0.8, 1] }}
              transition={{ duration: 3, ease: "circOut", times: [0, 0.3, 0.7, 1], repeat: Infinity, repeatDelay: 0.5 }}
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
                boxShadow: '0 0 10px var(--accent-primary)'
              }}
            />
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ repeat: Infinity, duration: 3, delay: 1 }}
            style={{
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.5)',
              marginTop: '0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase'
            }}
          >
            Establishing Secure Uplink
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
