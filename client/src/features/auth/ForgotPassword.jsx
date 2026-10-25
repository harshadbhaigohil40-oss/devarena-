import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '@/services';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authService.forgotPassword(email.trim());
      const msg = res.data?.data?.message || 'If that email exists, a password reset link has been sent.';
      toast.success(msg);
      setSubmitted(true);
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || 'Failed to process request. Please try again.';
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="page-container"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100dvh - var(--navbar-height))',
        padding: 'clamp(1rem, 3vw, 2rem)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card card-glass"
        style={{ width: '100%', maxWidth: 420 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔐</div>
          <h2 className="text-gradient" style={{ marginBottom: '0.5rem' }}>Reset Password</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Enter your account email and we'll send you instructions to reset your password.
          </p>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                padding: '1rem',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                color: 'var(--color-success, #10b981)',
                marginBottom: '1.5rem',
                fontSize: '0.95rem',
                lineHeight: 1.5,
              }}
            >
              If an account with <strong>{email}</strong> exists, a password reset link has been sent to it. Please check your inbox or spam folder.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                Resend or Try Another Email
              </button>
              <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-col gap-md">
            <div className="input-group">
              <label htmlFor="forgot-email">Email Address</label>
              <input
                id="forgot-email"
                name="email"
                type="email"
                className="input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={isSubmitting}
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link
                to="/login"
                style={{
                  color: 'var(--accent-primary)',
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                ← Back to Login
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
