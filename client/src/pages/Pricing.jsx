import { motion } from 'framer-motion';

export default function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for beginners just starting their coding journey.',
      features: [
        'Access to basic algorithm challenges',
        'Standard execution limits',
        'Community forum access',
        'Basic skill trees',
      ],
      buttonText: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$15',
      period: 'per month',
      description: 'For serious developers ready to level up their career.',
      features: [
        'All Free features',
        'Unlimited AI Career Advisor queries',
        'Unlimited ATS Resume Scans',
        'Premium system design challenges',
        'Priority execution queue',
        'Exclusive Pro badges',
      ],
      buttonText: 'Upgrade to Pro',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$49',
      period: 'per month',
      description: 'Advanced analytics and team management for recruiters.',
      features: [
        'All Pro features',
        'Access to Recruiter Dashboard',
        'Advanced talent search & filtering',
        'Direct messaging to candidates',
        'Custom company branded challenges',
      ],
      buttonText: 'Contact Sales',
      popular: false,
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container" style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center', padding: '4rem 2rem' }}>
      <div className="mb-xl">
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'var(--level-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Simple, transparent pricing
        </h1>
        <p className="text-muted" style={{ fontSize: '1.2rem', maxWidth: 600, margin: '0 auto' }}>
          Whether you're just starting out or hiring a full engineering team, we have a plan for you.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
        {plans.map((plan, idx) => (
          <motion.div 
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="card"
            style={{ 
              position: 'relative',
              padding: '2.5rem 2rem', 
              display: 'flex', 
              flexDirection: 'column',
              border: plan.popular ? '2px solid var(--accent-primary)' : '1px solid var(--border-primary)',
              transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
              zIndex: plan.popular ? 2 : 1,
              boxShadow: plan.popular ? '0 10px 40px rgba(108, 92, 231, 0.2)' : 'var(--shadow-md)',
            }}
          >
            {plan.popular && (
              <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-primary)', color: 'white', padding: '0.2rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px' }}>
                MOST POPULAR
              </div>
            )}
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{plan.name}</h3>
            <p className="text-muted text-sm mb-lg" style={{ minHeight: '40px' }}>{plan.description}</p>
            <div className="mb-lg">
              <span style={{ fontSize: '3rem', fontWeight: 800 }}>{plan.price}</span>
              <span className="text-muted"> / {plan.period}</span>
            </div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', textAlign: 'left', flex: 1 }}>
              {plan.features.map((feat, i) => (
                <li key={i} style={{ marginBottom: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>✓</span>
                  <span className="text-muted">{feat}</span>
                </li>
              ))}
            </ul>

            <button 
              className={`btn ${plan.popular ? 'btn-primary' : 'btn-ghost'}`} 
              style={{ width: '100%', padding: '1rem', fontSize: '1rem', border: plan.popular ? 'none' : '1px solid var(--border-primary)' }}
            >
              {plan.buttonText}
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
