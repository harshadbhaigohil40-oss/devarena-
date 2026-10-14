import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../features/theme/useThemeStore';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Pricing() {
  const { theme } = useThemeStore();
  const { isAuthenticated } = useAuth();

  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [submittingContact, setSubmittingContact] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    teamSize: '11-50',
    message: ''
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && contactModalOpen) {
        setContactModalOpen(false);
      }
    };
    if (contactModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [contactModalOpen]);

  const [copied, setCopied] = useState(false);
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'contact@devarena.io';

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSubmittingContact(true);

    const subject = encodeURIComponent(`Enterprise Inquiry: ${contactForm.company || contactForm.name}`);
    const body = encodeURIComponent(
      `Enterprise Sales & Team Inquiry for DevArena:\n\n` +
      `Full Name: ${contactForm.name}\n` +
      `Work Email: ${contactForm.email}\n` +
      `Company: ${contactForm.company}\n` +
      `Team Size: ${contactForm.teamSize}\n\n` +
      `Requirements / Message:\n${contactForm.message || 'No additional message provided.'}\n`
    );

    // Open user's real email client with pre-filled details
    const mailtoUrl = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;

    setTimeout(() => {
      setSubmittingContact(false);
      setContactModalOpen(false);
      setContactForm({ name: '', email: '', company: '', teamSize: '11-50', message: '' });
      toast.success("Inquiry drafted in your email client. Send to reach our team!");
    }, 300);
  };

  const handleCopyInquiry = () => {
    const text = `Enterprise Sales Inquiry for DevArena:\nName: ${contactForm.name}\nWork Email: ${contactForm.email}\nCompany: ${contactForm.company}\nTeam Size: ${contactForm.teamSize}\nMessage: ${contactForm.message}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Inquiry details copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Essential algorithm challenges and skill progression for all developers.',
      features: [
        'Access to core algorithm challenges',
        'Standard execution sandbox',
        'Personal dashboard & progress tracking',
        'Frontend, backend & DSA skill trees',
      ],
      buttonText: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$0',
      period: 'free in beta',
      badge: 'COMMUNITY BETA',
      description: 'Advanced challenges, AI Advisor, and system design tracks unlocked.',
      features: [
        'All Free features included',
        'AI Career Advisor & chat mentorship',
        'ATS Resume scanner & skill analysis',
        'Advanced system design challenges',
        'Global leaderboard ranking',
        'Exclusive achievement badges',
      ],
      buttonText: 'Start Coding Free',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'per team',
      description: 'Dedicated team management, candidate tracking, and custom challenges.',
      features: [
        'All developer & AI features',
        'Recruiter & talent pipeline dashboard',
        'Custom organization challenge suites',
        'Direct candidate messaging',
        'Priority platform support',
      ],
      buttonText: 'Contact Sales',
      popular: false,
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      data-theme={theme}
      className="page-container" 
      style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center', padding: 'clamp(2rem, 5vw, 4rem) clamp(0.75rem, 3vw, 2rem)' }}
    >
      <div className="mb-xl">
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem', background: 'var(--level-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Simple, transparent pricing
        </h1>
        <p className="text-muted" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', maxWidth: 600, margin: '0 auto 1.5rem auto' }}>
          Whether you're just starting out or hiring a full engineering team, we have a plan for you.
        </p>

        <div style={{
          padding: '0.75rem 1.25rem',
          borderRadius: '12px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.65rem',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          maxWidth: '700px',
          margin: '0 auto',
          textAlign: 'left'
        }}>
          <span style={{ fontSize: '1.25rem' }}>🚀</span>
          <span>
            <strong style={{ color: 'var(--text-primary)' }}>Community Edition:</strong> All core developer tracks, system design, and AI mentorship features are free and accessible. Commercial payment integrations can be configured by the platform operator.
          </span>
        </div>
      </div>

      <div className="pricing-grid" style={{ marginTop: '2.5rem' }}>
        {plans.map((plan, idx) => (
          <motion.div 
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`card ${plan.popular ? 'pricing-card-popular' : ''}`}
            style={{ 
              position: 'relative',
              padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 3vw, 2rem)', 
              display: 'flex', 
              flexDirection: 'column',
              border: plan.popular ? '2px solid var(--accent-primary)' : '1px solid var(--border-primary)',
              zIndex: plan.popular ? 2 : 1,
              boxShadow: plan.popular ? '0 10px 40px rgba(108, 92, 231, 0.2)' : 'var(--shadow-md)',
              overflow: plan.popular ? 'visible' : 'hidden',
            }}
          >
            {plan.popular && (
              <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-primary)', color: 'white', padding: '0.2rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px', whiteSpace: 'nowrap' }}>
                MOST POPULAR
              </div>
            )}
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{plan.name}</h3>
            <p className="text-muted text-sm mb-lg" style={{ minHeight: '40px' }}>{plan.description}</p>
            <div className="mb-lg">
              <span style={{ fontSize: 'clamp(2.25rem, 5vw, 3rem)', fontWeight: 800 }}>{plan.price}</span>
              <span className="text-muted"> / {plan.period}</span>
            </div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', textAlign: 'left', flex: 1 }}>
              {plan.features.map((feat, i) => (
                <li key={i} style={{ marginBottom: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.9375rem' }}>
                  <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>✓</span>
                  <span className="text-muted">{feat}</span>
                </li>
              ))}
            </ul>

            {plan.name === 'Free' && (
              <Link 
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="btn btn-ghost" 
                style={{ 
                  width: '100%', 
                  padding: '0.875rem', 
                  fontSize: '1rem', 
                  border: '1px solid var(--border-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
                data-testid="pricing-cta-free"
                aria-label="Get Started with Free Plan"
              >
                {isAuthenticated ? 'Go to Dashboard' : plan.buttonText}
              </Link>
            )}

            {plan.name === 'Pro' && (
              <Link 
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="btn btn-primary" 
                style={{ 
                  width: '100%', 
                  padding: '0.875rem', 
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  fontWeight: 600
                }}
                data-testid="pricing-cta-pro"
                aria-label="Upgrade to Pro Plan"
              >
                {plan.buttonText}
              </Link>
            )}

            {plan.name === 'Enterprise' && (
              <button 
                type="button"
                onClick={() => setContactModalOpen(true)}
                className="btn btn-secondary" 
                style={{ 
                  width: '100%', 
                  padding: '0.875rem', 
                  fontSize: '1rem', 
                  border: '1px solid var(--accent-primary)',
                  color: 'var(--text-primary)',
                  background: 'var(--bg-tertiary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                data-testid="pricing-cta-enterprise"
                aria-label="Contact Sales for Enterprise Plan"
              >
                {plan.buttonText}
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Enterprise Contact Sales Modal */}
      <AnimatePresence>
        {contactModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-sales-title"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(6px)',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setContactModalOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="card"
              style={{
                width: '100%',
                maxWidth: '520px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-accent)',
                boxShadow: 'var(--shadow-lg)',
                padding: '2rem',
                position: 'relative',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h2 id="contact-sales-title" style={{ fontSize: '1.35rem', margin: 0, color: 'var(--text-primary)' }}>
                    🏢 Contact Enterprise Sales
                  </h2>
                  <p className="text-muted" style={{ fontSize: '0.875rem', margin: '0.35rem 0 0' }}>
                    Custom plans, team seats, and dedicated platform support.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setContactModalOpen(false)}
                  className="btn btn-icon"
                  aria-label="Close dialog"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '1.25rem',
                    cursor: 'pointer',
                    padding: '0.25rem',
                  }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="input-group">
                  <label htmlFor="contact-name" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>
                    Full Name *
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    className="input"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="e.g. Sarah Connor"
                    style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', padding: '0.65rem 0.85rem' }}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="contact-email" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>
                    Work Email *
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="sarah@company.com"
                    style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', padding: '0.65rem 0.85rem' }}
                  />
                </div>

                <div className="grid grid-2" style={{ gap: '1rem' }}>
                  <div className="input-group">
                    <label htmlFor="contact-company" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>
                      Company *
                    </label>
                    <input
                      id="contact-company"
                      name="company"
                      className="input"
                      required
                      value={contactForm.company}
                      onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                      placeholder="Acme Corp"
                      style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', padding: '0.65rem 0.85rem' }}
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="contact-team-size" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>
                      Team Size
                    </label>
                    <select
                      id="contact-team-size"
                      name="teamSize"
                      className="input"
                      value={contactForm.teamSize}
                      onChange={(e) => setContactForm({ ...contactForm, teamSize: e.target.value })}
                      style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', padding: '0.65rem 0.85rem' }}
                    >
                      <option value="1-10">1 - 10 developers</option>
                      <option value="11-50">11 - 50 developers</option>
                      <option value="51-200">51 - 200 developers</option>
                      <option value="201+">201+ developers</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="contact-message" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>
                    Message / Requirements
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    className="input"
                    rows={3}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Tell us what your engineering team is looking for..."
                    style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', padding: '0.65rem 0.85rem', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="submit"
                    disabled={submittingContact}
                    className="btn btn-primary"
                    style={{ flex: 1, minWidth: '160px', padding: '0.75rem', fontSize: '0.95rem', fontWeight: 600, opacity: submittingContact ? 0.7 : 1 }}
                  >
                    {submittingContact ? 'Drafting Email...' : '✉️ Send via Email'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyInquiry}
                    className="btn btn-secondary"
                    style={{ padding: '0.75rem 1.25rem', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', fontWeight: 600 }}
                  >
                    {copied ? '✓ Copied!' : '📋 Copy Details'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactModalOpen(false)}
                    className="btn btn-ghost"
                    style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}
                  >
                    Cancel
                  </button>
                </div>

                <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                  <a
                    href={`mailto:${contactEmail}?subject=Enterprise%20Plan%20Inquiry`}
                    style={{ color: 'var(--accent-primary)', fontSize: '0.825rem', textDecoration: 'none' }}
                  >
                    Or reach out directly: {contactEmail}
                  </a>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
