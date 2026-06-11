import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Logged in successfully!');
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Invalid credentials or account locked.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card card-glass" style={{ width: '100%', maxWidth: 400 }}>
        <h2 className="mb-md text-center text-gradient">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="flex-col gap-md">
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={isSubmitting}>
            {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center mt-md text-sm text-muted">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </motion.div>
    </div>
  );
}
