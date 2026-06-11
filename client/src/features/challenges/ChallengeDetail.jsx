import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { challengeService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import Editor from '@monaco-editor/react';

export default function ChallengeDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { data: challenge, isLoading: loading } = useQuery({
    queryKey: ['challenge', slug],
    queryFn: async () => {
      const res = await challengeService.get(slug);
      return res.data.data.challenge;
    },
    onSuccess: (data) => {
      setCode(data.starterCode?.[language] || '// Write your solution here');
    },
    onError: () => toast.error('Challenge not found'),
  });

  useEffect(() => {
    if (challenge && !code) {
      setCode(challenge.starterCode?.[language] || '// Write your solution here');
    }
  }, [challenge]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    if (challenge && challenge.starterCode && challenge.starterCode[newLang]) {
      setCode(challenge.starterCode[newLang]);
    } else {
      setCode(newLang === 'python' ? '# Write your solution here' : '// Write your solution here');
    }
  };

  const handleSubmit = async () => {
    if (!user) return toast.error('Please sign in to submit');
    if (!code.trim()) return toast.error('Please write some code');
    setSubmitting(true);
    setResult(null);
    try {
      const res = await challengeService.submit(challenge._id, { code, language });
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
          <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
            <div className="flex justify-between items-center" style={{ padding: '1rem', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-tertiary)' }}>
              <h3 style={{ fontSize: '1rem', margin: 0 }}>💻 Code Editor</h3>
              <select 
                value={language} 
                onChange={handleLanguageChange}
                className="input"
                style={{ width: '130px', padding: '0.3rem', fontSize: '0.875rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)' }}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
              </select>
            </div>
            
            <div style={{ flex: 1, minHeight: '400px' }}>
              <Editor
                height="100%"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: 'var(--font-mono)',
                  lineHeight: 1.6,
                  padding: { top: 16 },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                }}
              />
            </div>
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
                <div key={i} className="flex items-center gap-sm mt-sm" style={{ flexWrap: 'wrap' }}>
                  <div className="flex items-center gap-sm w-full">
                    <span>{tr.passed ? '✅' : '❌'}</span>
                    <span className="text-sm">Test {i + 1}: {tr.passed ? 'Passed' : 'Failed'}</span>
                    <span className="text-xs text-muted">({tr.executionTime}ms)</span>
                  </div>
                  {!tr.passed && (
                    <div className="w-full mt-xs" style={{ background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--color-danger)' }}>
                      Output: {tr.output}
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
