import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const fadeUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };
const stagger = { animate: { transition: { staggerChildren: 0.1 } } };

const features = [
  { icon: '⚔️', title: 'Coding Challenges', desc: 'Solve challenges from beginner to expert, earn XP, and climb the ranks.' },
  { icon: '🌳', title: 'Skill Trees', desc: 'Visual learning paths that unlock as you progress through challenges.' },
  { icon: '🏆', title: 'Leaderboards', desc: 'Compete with developers worldwide. Weekly, monthly, and all-time rankings.' },
  { icon: '🏅', title: 'Badges & Rewards', desc: 'Unlock achievement badges from Common to Legendary rarity.' },
  { icon: '🚀', title: 'Project Showcase', desc: 'Build and showcase your projects. Get discovered by top recruiters.' },
  { icon: '🤖', title: 'AI Career Advisor', desc: 'Gemini-powered career guidance, skill recommendations, and code reviews.' },
];

const stats = [
  { value: '15+', label: 'Challenges' },
  { value: '20+', label: 'Badges' },
  { value: '4', label: 'Skill Trees' },
  { value: '∞', label: 'Possibilities' },
];

export default function Landing() {
  return (
    <motion.div initial="initial" animate="animate" style={{ paddingTop: 'var(--navbar-height)' }}>
      {/* Hero */}
      <section style={{
        minHeight: 'calc(100vh - var(--navbar-height))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '4rem 1.5rem',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Animated orbs */}
        <div style={{ position: 'absolute', top: '10%', left: '15%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,92,231,0.15), transparent 70%)', filter: 'blur(60px)', animation: 'float 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,206,201,0.1), transparent 70%)', filter: 'blur(60px)', animation: 'float 10s ease-in-out infinite reverse' }} />

        <motion.div {...fadeUp} style={{ maxWidth: 800, position: 'relative', zIndex: 1 }}>
          <motion.div {...fadeUp} style={{ marginBottom: '1.5rem' }}>
            <span className="badge badge-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>
              ⚡ The Gamified Developer Platform
            </span>
          </motion.div>

          <motion.h1 {...fadeUp} style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900,
            lineHeight: 1.1, marginBottom: '1.5rem',
          }}>
            Level Up Your
            <br />
            <span className="text-gradient">Coding Career</span>
          </motion.h1>

          <motion.p {...fadeUp} style={{
            fontSize: '1.2rem', color: 'var(--text-secondary)',
            maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.7,
          }}>
            Solve challenges, earn XP, unlock badges, build skill trees,
            showcase projects, and get discovered by top recruiters.
            Your developer journey starts here.
          </motion.p>

          <motion.div {...fadeUp} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/register" className="btn btn-primary btn-lg" style={{ fontSize: '1.05rem' }}>
                🚀 Create Free Account
              </Link>
            </motion.div>
            <Link to="/challenges" className="btn btn-secondary btn-lg" style={{ fontSize: '1.05rem' }}>
              Browse Challenges
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div {...fadeUp} style={{
            display: 'flex', justifyContent: 'center', gap: '3rem',
            marginTop: '4rem', flexWrap: 'wrap',
          }}>
            {stats.map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: '2rem', fontWeight: 800 }} className="text-gradient">{s.value}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section style={{ padding: '5rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}>
        <motion.div variants={stagger} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
            Everything You Need to <span className="text-gradient">Level Up</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
            A complete gamified ecosystem for developers who want to grow, compete, and get discovered.
          </p>
        </motion.div>

        <div className="grid grid-3" style={{ gap: '1.5rem' }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card"
              style={{ textAlign: 'center', padding: '2rem 1.5rem' }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '5rem 1.5rem', textAlign: 'center',
        background: 'linear-gradient(180deg, transparent, rgba(108,92,231,0.05), transparent)',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="card card-glass"
          style={{ maxWidth: 700, margin: '0 auto', padding: '3rem 2rem', textAlign: 'center' }}
        >
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>
            Ready to <span className="text-gradient">Enter the Arena?</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.05rem' }}>
            Join thousands of developers leveling up their skills every day.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Create Free Account ⚡
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid var(--border-primary)', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
        <p>© {new Date().getFullYear()} DEVARENA. Built with 💜 for developers.</p>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
      `}</style>
    </motion.div>
  );
}
