import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'developer' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const success = await register(formData.username, formData.email, formData.password, formData.role);
      if (success) {
        toast.success('Registration successful! Please sign in.');
        navigate('/login');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Registration failed.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const success = await loginWithGoogle(credentialResponse.credential);
      if (success) {
        toast.success('Signed up with Google successfully!');
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Google authentication failed.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100dvh - var(--navbar-height))', padding: 'clamp(1rem, 3vw, 2rem)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card card-glass" style={{ width: '100%', maxWidth: 450 }}>
        <h2 className="mb-md text-center text-gradient">Create Account</h2>
        <form onSubmit={handleSubmit} className="flex-col gap-md">
          <div className="input-group">
            <label htmlFor="register-username">Username</label>
            <input 
              id="register-username"
              name="username"
              type="text" 
              className="input" 
              value={formData.username} 
              onChange={(e) => setFormData({...formData, username: e.target.value})} 
              autoComplete="username"
              required 
              minLength={3} 
              disabled={isSubmitting}
            />
          </div>
          <div className="input-group">
            <label htmlFor="register-email">Email Address</label>
            <input 
              id="register-email"
              name="email"
              type="email" 
              className="input" 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              autoComplete="email"
              required 
              disabled={isSubmitting}
            />
          </div>
          <div className="input-group">
            <label htmlFor="register-password">Password</label>
            <input 
              id="register-password"
              name="password"
              type="password" 
              className="input" 
              value={formData.password} 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              autoComplete="new-password"
              required 
              minLength={6} 
              disabled={isSubmitting}
            />
          </div>
          <div className="input-group">
            <label htmlFor="register-role">I am a...</label>
            <select 
              id="register-role"
              name="role"
              className="input" 
              value={formData.role} 
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              disabled={isSubmitting}
            >
              <option value="developer">Developer</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem' }} 
            disabled={isSubmitting}
            data-testid="register-submit-btn"
          >
            {isSubmitting ? 'Creating...' : 'Register'}
          </button>
        </form>

        <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ borderBottom: '1px solid var(--border)', flexGrow: 1 }}></span>
          <span style={{ padding: '0 1rem', color: 'var(--text-muted)' }}>OR</span>
          <span style={{ borderBottom: '1px solid var(--border)', flexGrow: 1 }}></span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', maxWidth: '100%', overflow: 'hidden' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              toast.error('Google Sign Up Failed');
            }}
          />
        </div>

        <p className="text-center mt-md text-sm text-muted">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
