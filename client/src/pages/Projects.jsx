import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projectService } from '../services';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', liveUrl: '', repoUrl: '', techStack: '' });

  useEffect(() => {
    projectService.list().then(r => setProjects(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, techStack: typeof form.techStack === 'string' ? form.techStack.split(',').map(s => s.trim()).filter(Boolean) : form.techStack };
      
      if (editingId) {
        const res = await projectService.update(editingId, data);
        setProjects(projects.map(p => p._id === editingId ? res.data.data.project : p));
        toast.success('Project updated successfully! ✨');
      } else {
        const res = await projectService.create(data);
        setProjects([res.data.data.project, ...projects]);
        toast.success('Project launched! +150 XP 🚀');
      }
      
      setShowForm(false);
      setEditingId(null);
      setForm({ title: '', description: '', liveUrl: '', repoUrl: '', techStack: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || `Failed to ${editingId ? 'update' : 'launch'} project`);
    }
  };

  const handleLike = async (id) => {
    try {
      const res = await projectService.like(id);
      setProjects(projects.map(p => p._id === id ? { ...p, likes: res.data.data.likes } : p));
    } catch { }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this project?')) return;
    try {
      await projectService.delete(id);
      setProjects(projects.filter(p => p._id !== id));
      toast.success('Project permanently deleted');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete project');
    }
  };

  const handleEdit = (project) => {
    setForm({
      title: project.title || '',
      description: project.description || '',
      liveUrl: project.liveUrl || '',
      repoUrl: project.repoUrl || '',
      techStack: project.techStack ? project.techStack.join(', ') : ''
    });
    setEditingId(project._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ title: '', description: '', liveUrl: '', repoUrl: '', techStack: '' });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
      {/* Premium Header */}
      <div className="flex justify-between items-center mb-xl" style={{ flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: 10 }}>
        <div style={{ marginBottom: 0 }}>
          <h1 className="mb-sm flex items-center gap-sm" style={{ fontSize: '2.5rem' }}>
            <motion.span 
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              style={{ display: 'inline-block', filter: 'drop-shadow(0 0 10px rgba(0,206,201,0.5))' }}
            >
              🚀
            </motion.span> 
            <span style={{ background: 'linear-gradient(135deg, var(--text-primary), var(--accent-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Project Showcase
            </span>
          </h1>
          <p className="text-muted" style={{ fontSize: '1.1rem' }}>Discover and share amazing developer projects</p>
        </div>
        {user && (
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(108,92,231,0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { 
              if (showForm && !editingId) {
                setShowForm(false);
              } else {
                setEditingId(null); 
                setForm({ title: '', description: '', liveUrl: '', repoUrl: '', techStack: '' }); 
                setShowForm(true); 
              }
            }} 
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', fontWeight: 600, background: showForm && !editingId ? 'var(--bg-tertiary)' : 'var(--accent-primary)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {showForm && !editingId ? 'Close Form' : '✨ Launch Project'}
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form 
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }} 
            animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit} 
            style={{ marginBottom: '2rem' }}
          >
            <div className="card" style={{ 
              display: 'flex', flexDirection: 'column', gap: '1.5rem', 
              background: 'linear-gradient(135deg, rgba(30,30,40,0.9), rgba(20,20,30,0.95))', 
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(108,92,231,0.3)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 40px rgba(108,92,231,0.1)',
              position: 'relative'
            }}>
              {/* Form Glow */}
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', height: '2px', background: 'linear-gradient(90deg, transparent, var(--accent-primary), transparent)', opacity: 0.5 }} />
              
              <h3 style={{ fontSize: '1.5rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {editingId ? '✏️ Edit Project Details' : '🌟 Launch New Project'}
              </h3>
              
              <div className="input-group">
                <label style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Project Title</label>
                <input className="input" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem' }} value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="E.g., Devarena AI Integration" required />
              </div>
              
              <div className="input-group">
                <label style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Description</label>
                <textarea className="input" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', minHeight: '100px' }} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="What does this project do?" required />
              </div>
              
              <div className="grid grid-2" style={{ gap: '1.5rem' }}>
                <div className="input-group">
                  <label style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Live URL <span className="text-muted">(Optional)</span></label>
                  <input className="input" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)' }} value={form.liveUrl} onChange={e => setForm({...form, liveUrl: e.target.value})} placeholder="https://myapp.com" />
                </div>
                <div className="input-group">
                  <label style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Repository URL <span className="text-muted">(Optional)</span></label>
                  <input className="input" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)' }} value={form.repoUrl} onChange={e => setForm({...form, repoUrl: e.target.value})} placeholder="https://github.com/username/repo" />
                </div>
              </div>
              
              <div className="input-group">
                <label style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Tech Stack (comma-separated)</label>
                <input className="input" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)' }} value={form.techStack} onChange={e => setForm({...form, techStack: e.target.value})} placeholder="React, Node.js, MongoDB, TailwindCSS" />
              </div>
              
              <div className="flex gap-sm mt-sm">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.75rem', fontSize: '1rem' }}>
                  {editingId ? 'Save Changes' : '🚀 Publish Project'}
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={handleCancel} className="btn" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid grid-3" style={{ gap: '1.5rem' }}>{[1,2,3,4,5,6].map(i => <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className="card skeleton" style={{ height: '280px', borderRadius: 'var(--radius-lg)' }} />)}</div>
      ) : projects.length === 0 ? (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card text-center" style={{ padding: '5rem 2rem', borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.1)' }}>
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} style={{ fontSize: '4rem', marginBottom: '1rem', display: 'block', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.5))' }}>🚀</motion.div>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>No projects yet</h3>
          <p className="text-muted mt-sm mb-lg">The universe is empty. Be the first to showcase your brilliant work!</p>
          {user && <button onClick={() => setShowForm(true)} className="btn btn-primary">Launch the First Project</button>}
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-3" style={{ gap: '1.5rem' }}>
          <AnimatePresence>
            {projects.map((p, i) => (
              <motion.div 
                key={p._id} 
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ y: -10, scale: 1.02 }}
                style={{ height: '100%' }}
              >
                <div className="card" style={{ 
                  height: '100%', display: 'flex', flexDirection: 'column',
                  background: 'var(--bg-secondary)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                }}>
                  {/* Card Glow on Hover */}
                  <div className="hover-glow-bg" style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: `radial-gradient(circle, rgba(108,92,231,0.15) 0%, transparent 50%)`, opacity: 0, transition: 'opacity 0.3s ease', zIndex: 0, pointerEvents: 'none' }} />
                  
                  <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div className="flex justify-between items-start mb-md">
                      <h3 style={{ fontSize: '1.3rem', lineHeight: 1.3, marginBottom: '0.5rem', flex: 1, paddingRight: '1rem', wordBreak: 'break-word', color: 'var(--text-primary)' }}>{p.title}</h3>
                      {(user?._id === p.userId?._id || user?._id === p.userId) && (
                        <div className="flex gap-xs">
                          <motion.button 
                            whileHover={{ scale: 1.1, backgroundColor: 'var(--color-info)' }} whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(p)} 
                            className="btn btn-icon" 
                            style={{ 
                              color: 'var(--color-info)', background: 'var(--color-info-bg)', border: '1px solid rgba(116, 185, 255, 0.2)', padding: '0.4rem', borderRadius: '8px', flexShrink: 0, transition: 'all 0.2s ease'
                            }}
                            title="Edit Project"
                            onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; }}
                            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--color-info)'; }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1, backgroundColor: 'var(--color-danger)' }} whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(p._id)} 
                            className="btn btn-icon" 
                            style={{ 
                              color: 'var(--color-danger)', background: 'var(--color-danger-bg)', border: '1px solid rgba(255, 107, 107, 0.2)', padding: '0.4rem', borderRadius: '8px', flexShrink: 0, transition: 'all 0.2s ease'
                            }}
                            title="Delete Project"
                            onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; }}
                            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--color-danger)'; }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                          </motion.button>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-muted text-sm mb-lg" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
                      {p.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-xs mb-lg">
                      {p.techStack?.map((t, j) => (
                        <span key={j} className="badge" style={{ background: 'rgba(108,92,231,0.1)', color: 'var(--accent-primary)', border: '1px solid rgba(108,92,231,0.2)', fontSize: '0.75rem' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center pt-md" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <div className="flex items-center gap-md text-sm text-muted">
                        <span className="flex items-center gap-xs" title="Views"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> {p.views || 0}</span>
                        <motion.button 
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }}
                          onClick={() => handleLike(p._id)} 
                          className="btn btn-ghost btn-sm flex items-center gap-xs" 
                          style={{ padding: '0.25rem 0.5rem', color: p.likes > 0 ? '#ff4757' : 'var(--text-muted)' }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill={p.likes > 0 ? '#ff4757' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> 
                          {p.likes || 0}
                        </motion.button>
                      </div>
                      <div className="flex gap-sm">
                        {p.repoUrl && (
                          <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href={p.repoUrl} target="_blank" rel="noreferrer" className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}>
                            Code
                          </motion.a>
                        )}
                        {p.liveUrl && (
                          <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href={p.liveUrl} target="_blank" rel="noreferrer" className="btn btn-sm" style={{ background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 0 10px rgba(108,92,231,0.4)' }}>
                            Live ↗
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}
