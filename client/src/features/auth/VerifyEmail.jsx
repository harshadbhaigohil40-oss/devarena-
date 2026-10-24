import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function verify() {
      if (!token) {
        if (isMounted) {
          setStatus('error');
          setMessage('No verification token provided in URL.');
        }
        return;
      }

      try {
        const response = await api.post('/auth/verify-email', { token });
        if (isMounted) {
          setStatus('success');
          const msg = response?.data?.data?.message || 'Email verified successfully!';
          setMessage(msg);
          toast.success(msg);
        }
      } catch (err) {
        if (isMounted) {
          setStatus('error');
          const errMsg = err?.response?.data?.error || err.message || 'Verification token is invalid or has expired.';
          setMessage(errMsg);
          toast.error(errMsg);
        }
      }
    }

    verify();

    return () => {
      isMounted = false;
    };
  }, [token]);

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
        style={{ width: '100%', maxWidth: 450, textAlign: 'center', padding: '2rem' }}
      >
        {status === 'loading' && (
          <div>
            <div
              className="spinner"
              style={{
                width: 48,
                height: 48,
                border: '4px solid rgba(255, 255, 255, 0.1)',
                borderTopColor: 'var(--primary)',
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                animation: 'spin 1s linear infinite',
              }}
            />
            <h2 className="text-gradient mb-sm">Verifying Email</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Please wait while we confirm your email address...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.15)',
                color: '#22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: 28,
              }}
            >
              ✓
            </div>
            <h2 className="text-gradient mb-sm">Email Verified!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              {message}
            </p>
            <button
              onClick={() => navigate('/login')}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Continue to Login
            </button>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: 28,
              }}
            >
              ✕
            </div>
            <h2 className="text-gradient mb-sm" style={{ color: '#ef4444' }}>
              Verification Failed
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              {message}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <Link to="/login" className="btn btn-primary" style={{ flex: 1 }}>
                Sign In
              </Link>
              <Link to="/" className="btn btn-secondary" style={{ flex: 1 }}>
                Home
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
