import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'developer' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const success = await register(formData.username, formData.email, formData.password, formData.role);
      if (success) {
        toast.success('Registration successful! Please sign in.');
        navigate('/login');
      }
    } catch (err) {
      toast.error('Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card card-glass" style={{ width: '100%', maxWidth: 450 }}>
        <h2 className="mb-md text-center text-gradient">Create Account</h2>
        <form onSubmit={handleSubmit} className="flex-col gap-md">
          <div className="input-group">
            <label>Username</label>
            <input type="text" className="input" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required minLength={3} />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" className="input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" className="input" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required minLength={6} />
          </div>
          <div className="input-group">
            <label>I am a...</label>
            <select className="input" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
              <option value="developer">Developer</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Register'}
          </button>
        </form>
        <p className="text-center mt-md text-sm text-muted">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
