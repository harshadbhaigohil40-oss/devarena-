import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { challengeService } from '../services';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

export default function ChallengeDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    challengeService.get(slug)
      .then(r => {
        setChallenge(r.data.data.challenge);
        setCode(r.data.data.challenge.starterCode?.javascript || '// Write your solution here');
      })
      .catch(() => toast.error('Challenge not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSubmit = async () => {
    if (!user) return toast.error('Please sign in to submit');
    if (!code.trim()) return toast.error('Please write some code');
    setSubmitting(true);
    setResult(null);
    try {
      const res = await challengeService.submit(challenge._id, { code, language: 'javascript' });
      setResult(res.data.data);
      if (res.data.data.allPassed) {
        toast.success(`Challenge solved! +${res.data.data.xpResult?.xpEarned || challenge.xpReward} XP 🎉`);
      } else {
        toast.error('Some tests failed. Try again!');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page-container"><div className="skeleton" style={{ height: 400 }} /></div>;
  if (!challenge) return <div className="page-container"><div className="empty-state"><h3>Challenge not found</h3></div></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
      <div className="flex justify-between items-center mb-lg" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="flex items-center gap-sm mb-sm">
            <span className={`badge difficulty-badge-${challenge.difficulty}`} style={{ textTransform: 'capitalize' }}>{challenge.difficulty}</span>
            <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{challenge.category}</span>
            <span style={{ color: 'var(--xp-gold)', fontWeight: 700, fontSize: '0.875rem' }}>⚡ {challenge.xpReward} XP</span>
          </div>
          <h1 style={{ fontSize: '1.75rem' }}>{challenge.title}</h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Description */}
        <div className="card" style={{ maxHeight: '70vh', overflow: 'auto' }}>
          <h3 style={{ marginBottom: '1rem' }}>📋 Description</h3>
          <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <ReactMarkdown>{challenge.description}</ReactMarkdown>
          </div>
          {challenge.testCases?.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{ marginBottom: '0.75rem' }}>Test Cases</h4>
              {challenge.testCases.map((tc, i) => (
                <div key={i} className="card" style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', marginBottom: '0.5rem' }}>
                  <p className="text-sm"><strong>Input:</strong> <code className="font-mono">{tc.input}</code></p>
                  <p className="text-sm"><strong>Expected:</strong> <code className="font-mono">{tc.expectedOutput}</code></p>
                </div>
              ))}
            </div>
          )}
          {challenge.hints?.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>💡 Hints</h4>
              {challenge.hints.map((h, i) => <p key={i} className="text-sm text-muted" style={{ marginBottom: '0.25rem' }}>• {h}</p>)}
            </div>
          )}
        </div>

        {/* Code Editor */}
        <div className="flex flex-col gap-md">
          <div className="card" style={{ flex: 1 }}>
            <div className="flex justify-between items-center mb-md">
              <h3>💻 Code Editor</h3>
              <span className="badge badge-info">JavaScript</span>
            </div>
            <textarea value={code} onChange={e => setCode(e.target.value)}
              style={{
                width: '100%', minHeight: 350, padding: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.875rem',
                background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)', resize: 'vertical', outline: 'none', lineHeight: 1.6, tabSize: 2,
              }}
              spellCheck={false}
            />
          </div>

          <button onClick={handleSubmit} disabled={submitting} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            {submitting ? '⏳ Running tests...' : '▶️ Submit Solution'}
          </button>

          {/* Results */}
          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="card" style={{ borderColor: result.allPassed ? 'var(--color-success)' : 'var(--color-danger)', background: result.allPassed ? 'var(--color-success-bg)' : 'var(--color-danger-bg)' }}>
              <h3 style={{ color: result.allPassed ? 'var(--color-success)' : 'var(--color-danger)', marginBottom: '0.75rem' }}>
                {result.allPassed ? '✅ All Tests Passed!' : '❌ Some Tests Failed'}
              </h3>
              {result.xpResult && (
                <p style={{ color: 'var(--xp-gold)', fontWeight: 700 }}>+{result.xpResult.xpEarned} XP earned!</p>
              )}
              {result.submission?.testResults?.map((tr, i) => (
                <div key={i} className="flex items-center gap-sm mt-sm">
                  <span>{tr.passed ? '✅' : '❌'}</span>
                  <span className="text-sm">Test {i + 1}: {tr.passed ? 'Passed' : 'Failed'}</span>
                  <span className="text-xs text-muted">({tr.executionTime}ms)</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
