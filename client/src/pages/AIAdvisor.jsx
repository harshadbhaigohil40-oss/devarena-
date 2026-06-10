import { useState } from 'react';
import { motion } from 'framer-motion';
import { aiService } from '../services';
import { useAuth } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

export default function AIAdvisor() {
  const { user } = useAuth();
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('career');

  const handleAsk = async () => {
    if (!user) return toast.error('Please sign in');
    if (tab === 'career' && !question.trim()) return toast.error('Please enter a question');
    setLoading(true);
    setResponse('');
    try {
      let res;
      if (tab === 'career') {
        res = await aiService.getCareerAdvice(question);
        setResponse(res.data.data.advice);
      } else if (tab === 'skills') {
        res = await aiService.getSkillRecommendation();
        setResponse(res.data.data.recommendation);
      } else {
        res = await aiService.getCodeReview(question, 'javascript');
        setResponse(res.data.data.review);
      }
    } catch (err) {
      toast.error('AI request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
      <div className="page-header">
        <h1>🤖 AI Career Advisor</h1>
        <p>Powered by Google Gemini — Get personalized career guidance</p>
      </div>

      <div className="tabs">
        {[
          { key: 'career', label: '💼 Career Advice' },
          { key: 'skills', label: '📚 Skill Recommendations' },
          { key: 'review', label: '🔍 Code Review' },
        ].map(t => (
          <button key={t.key} className={`tab ${tab === t.key ? 'active' : ''}`} onClick={() => { setTab(t.key); setResponse(''); }}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-2" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>
            {tab === 'career' ? '💬 Ask a Question' : tab === 'skills' ? '📊 Your Profile' : '💻 Paste Your Code'}
          </h3>
          {tab === 'skills' ? (
            <div>
              <p className="text-muted mb-md">Click the button to get AI-powered skill recommendations based on your profile.</p>
              <div className="card" style={{ background: 'var(--bg-tertiary)' }}>
                <p className="text-sm"><strong>Level:</strong> {user?.level}</p>
                <p className="text-sm"><strong>XP:</strong> {user?.xp}</p>
                <p className="text-sm"><strong>Streak:</strong> {user?.streak || 0} days</p>
              </div>
            </div>
          ) : (
            <textarea className="input" value={question} onChange={e => setQuestion(e.target.value)}
              placeholder={tab === 'career' ? 'What career path should I follow as a full-stack developer?' : 'Paste your code here for AI review...'}
              style={{ minHeight: 200, fontFamily: tab === 'review' ? 'var(--font-mono)' : 'var(--font-sans)', fontSize: '0.875rem' }} />
          )}
          <button onClick={handleAsk} disabled={loading} className="btn btn-primary mt-md" style={{ width: '100%' }}>
            {loading ? '🔄 Thinking...' : '✨ Get AI Response'}
          </button>
        </div>

        <div className="card" style={{ maxHeight: '70vh', overflow: 'auto' }}>
          <h3 style={{ marginBottom: '1rem' }}>🤖 AI Response</h3>
          {loading ? (
            <div>
              {[1,2,3,4,5].map(i => <div key={i} className="skeleton skeleton-text" style={{ width: `${100 - i * 10}%` }} />)}
            </div>
          ) : response ? (
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.9375rem' }}>
              <ReactMarkdown>{response}</ReactMarkdown>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '3rem 1rem' }}>
              <div className="empty-icon">🤖</div>
              <h3>Ask the AI Advisor</h3>
              <p>Get personalized career guidance, skill recommendations, or code reviews</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
