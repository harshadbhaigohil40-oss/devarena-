import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '@/services';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!token) {
      toast.error('Missing or invalid reset token. Please request a new link.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authService.resetPassword(token, password);
      const msg = res.data?.data?.message || 'Password has been reset successfully!';
      toast.success(msg);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2500);
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || 'Token is invalid or has expired.';
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
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
          style={{ width: '100%', maxWidth: 420, textAlign: 'center', padding: '2rem' }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚠️</div>
          <h2 className="text-gradient" style={{ marginBottom: '0.75rem' }}>Invalid Reset Link</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            No password reset token was provided. The link in your email may be incomplete or expired.
          </p>
          <Link to="/forgot-password" className="btn btn-primary" style={{ width: '100%' }}>
            Request New Reset Link
          </Link>
        </motion.div>
      </div>
    );
  }

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
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔑</div>
          <h2 className="text-gradient" style={{ marginBottom: '0.5rem' }}>Set New Password</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Please choose a strong password with at least 6 characters.
          </p>
        </div>

        {isSuccess ? (
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
              }}
            >
              Password reset successful! Redirecting you to login...
            </div>
            <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-col gap-md">
            <div className="input-group">
              <label htmlFor="new-password">New Password</label>
              <input
                id="new-password"
                name="password"
                type="password"
                className="input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                minLength={6}
                disabled={isSubmitting}
                autoFocus
              />
            </div>

            <div className="input-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                className="input"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                minLength={6}
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating Password...' : 'Reset Password'}
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
