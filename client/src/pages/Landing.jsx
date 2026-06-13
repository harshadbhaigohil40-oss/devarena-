import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const fadeUp = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-100px" }, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } };
const stagger = { animate: { transition: { staggerChildren: 0.1 } } };

const features = [
  { icon: '⚔️', title: 'Interactive Challenges', desc: 'Solve real-world engineering problems from beginner to staff-level difficulty. Run code against robust test suites.' },
  { icon: '🧠', title: 'AI Career Advisor', desc: 'Get personalized feedback, mock interviews, and code reviews from our fine-tuned Gemini AI models.' },
  { icon: '🌳', title: 'Dynamic Skill Trees', desc: 'Visualize your growth. Master algorithms, system design, and modern frameworks to unlock new nodes.' },
  { icon: '🏆', title: 'Global Leaderboards', desc: 'See where you stand. Compete in weekly tournaments and earn unique badges for top percentile finishes.' },
  { icon: '💼', title: 'Recruiter Matchmaking', desc: 'Top startups and enterprises search our leaderboard for verified talent. Let the offers come to you.' },
  { icon: '🚀', title: 'Portfolio Projects', desc: 'Showcase complex architectures, not just LeetCode answers. Build production-ready microservices.' },
];

export default function Landing() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} style={{ background: 'var(--bg-primary)', overflow: 'hidden' }}>
      {/* Background Grid */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px', maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 10%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 10%, transparent 100%)', pointerEvents: 'none'
      }} />

      {/* Hero Section */}
      <section style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 'calc(var(--navbar-height) + 4rem)' }}>
        <motion.div style={{ y, opacity, position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '90vw', height: '90vw', maxWidth: '1000px', maxHeight: '1000px', background: 'radial-gradient(circle, rgba(138, 43, 226, 0.15) 0%, transparent 60%)', filter: 'blur(100px)', zIndex: -1, pointerEvents: 'none' }} />
        
        <div className="page-container" style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
            <div style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '0.75rem', 
              background: 'var(--bg-secondary)', 
              border: '1px solid var(--border-primary)', 
              padding: '0.6rem 1.5rem', 
              borderRadius: '100px', 
              marginBottom: '2.5rem', 
              backdropFilter: 'blur(12px)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', background: 'rgba(0, 230, 118, 0.2)', borderRadius: '50%' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-success)', boxShadow: '0 0 10px var(--color-success)' }} />
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0', letterSpacing: '0.5px' }}>DevArena Platform 2.0</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: '1.5rem', color: 'var(--text-primary)', textShadow: 'var(--shadow-sm)' }}>
            Level Up <br />
            <span style={{ background: 'linear-gradient(135deg, #6c5ce7 0%, #00cec9 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block', paddingBottom: '10px' }}>
              Your Code
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: 'clamp(1.125rem, 2vw, 1.35rem)', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto 3.5rem', lineHeight: 1.7, fontWeight: 400 }}>
            The gamified platform for ambitious developers. Solve challenges, earn XP and badges, master skill trees, and get hired by elite engineering teams.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <div style={{ background: '#fff', color: '#000', padding: '1.1rem 2.5rem', borderRadius: '100px', fontWeight: 600, fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer', boxShadow: '0 8px 25px rgba(255,255,255,0.2)' }} onMouseOver={e => {e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(255,255,255,0.3)';}} onMouseOut={e => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,255,255,0.2)';}}>
                Start Coding Free
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </div>
            </Link>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', padding: '1.1rem 2.5rem', borderRadius: '100px', fontWeight: 600, fontSize: '1.125rem', display: 'flex', alignItems: 'center', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer', backdropFilter: 'blur(10px)' }} onMouseOver={e => {e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.borderColor = 'var(--border-secondary)';}} onMouseOut={e => {e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.borderColor = 'var(--border-primary)';}}>
                Sign In
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section style={{ position: 'relative', zIndex: 1, padding: '4rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.02), transparent)' }}>
        <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2rem' }}>Engineers from top companies train here</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(2rem, 5vw, 4rem)', flexWrap: 'wrap', opacity: 0.5, filter: 'grayscale(100%)', maxWidth: '1000px', margin: '0 auto' }}>
          {['Google', 'Stripe', 'Vercel', 'Meta', 'Amazon', 'Netflix'].map(company => (
            <span key={company} style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px' }}>{company}</span>
          ))}
        </div>
      </section>

      {/* Features Showcase */}
      <section style={{ position: 'relative', zIndex: 1, padding: '8rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: '5rem', maxWidth: '800px', margin: '0 auto 5rem' }}>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            A complete ecosystem for <br/><span style={{ color: 'var(--accent-primary)' }}>software excellence.</span>
          </h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>DevArena isn't just about algorithms. It's about building a verifiable portfolio of skills that engineering managers actually care about.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {features.map((f, i) => (
            <motion.div key={i} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.1 }}
              style={{
                background: 'var(--bg-secondary)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid var(--border-primary)', 
                borderRadius: '24px', 
                padding: '2.5rem',
                position: 'relative', 
                overflow: 'hidden', 
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(138, 43, 226, 0.4)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, var(--border-secondary), transparent)', opacity: 0.3 }} />
              <div style={{ fontSize: '2rem', marginBottom: '1.5rem', background: 'var(--bg-tertiary)', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', border: '1px solid var(--border-primary)' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1rem' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Metrics Section */}
      <section style={{ position: 'relative', zIndex: 1, padding: '6rem 1.5rem', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-primary)', borderBottom: '1px solid var(--border-primary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', textAlign: 'center' }}>
          {[
            { metric: '500k+', label: 'Lines of Code Evaluated' },
            { metric: '99.9%', label: 'Uptime SLA' },
            { metric: '<50ms', label: 'Average Execution Time' },
            { metric: '10k+', label: 'Hired Developers' }
          ].map((stat, i) => (
            <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-1px', marginBottom: '0.5rem' }}>{stat.metric}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ position: 'relative', zIndex: 1, padding: '10rem 1.5rem', textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100vw', height: '500px', background: 'radial-gradient(ellipse at center, rgba(108,92,231,0.15) 0%, transparent 60%)', filter: 'blur(60px)', zIndex: -1, pointerEvents: 'none' }} />
        <motion.div {...fadeUp} style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>Ready to push to production?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', marginBottom: '2.5rem' }}>Join the elite network of developers transforming their careers.</p>
          <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--accent-primary)', color: '#fff', padding: '1.25rem 3rem', borderRadius: '100px', fontWeight: 600, fontSize: '1.125rem', textDecoration: 'none', transition: 'all 0.2s ease', boxShadow: '0 0 30px var(--accent-primary-glow)' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
            Get Started Now
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 1, padding: '3rem 1.5rem', borderTop: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '24px', height: '24px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', borderRadius: '6px', display: 'inline-block' }} />
          <span style={{ fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>DEVARENA</span>
        </div>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='var(--text-primary)'} onMouseOut={e => e.currentTarget.style.color='var(--text-secondary)'}>Changelog</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='var(--text-primary)'} onMouseOut={e => e.currentTarget.style.color='var(--text-secondary)'}>Documentation</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='var(--text-primary)'} onMouseOut={e => e.currentTarget.style.color='var(--text-secondary)'}>Twitter</span>
        </div>
      </footer>
    </div>
  );
}
