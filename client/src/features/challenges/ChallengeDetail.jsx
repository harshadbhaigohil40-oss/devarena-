import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { challengeService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import ChatMarkdown from '@/components/ui/ChatMarkdown';
import Editor from '@monaco-editor/react';

const LANG_LABELS = { javascript: 'JavaScript', python: 'Python' };
const LANG_ICONS  = { javascript: '🟨', python: '🐍' };

export default function ChallengeDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [language, setLanguage]       = useState('javascript');
  const [userCode, setUserCode]       = useState({ javascript: '', python: '' });
  const [result, setResult]           = useState(null);
  const [running, setRunning]         = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [activeTab, setActiveTab]     = useState('description'); // 'description' | 'results'
  const [mobileView, setMobileView]   = useState('problem'); // 'problem' | 'editor' | 'results'

  const { data: challenge, isLoading: loading } = useQuery({
    queryKey: ['challenge', slug],
    queryFn: async () => {
      const res = await challengeService.get(slug);
      return res.data.data.challenge;
    }
  });

  useEffect(() => {
    if (challenge?.starterCode) {
      setUserCode({
        javascript: challenge.starterCode.javascript || '// Write your solution here\n',
        python: challenge.starterCode.python || '# Write your solution here\n',
      });
      setResult(null);
    }
  }, [challenge]);

  const activeCode = userCode[language] || '';

  const handleEditorChange = (value) =>
    setUserCode(prev => ({ ...prev, [language]: value || '' }));

  const handleReset = () => {
    setUserCode(prev => ({ ...prev, [language]: challenge?.starterCode?.[language] || '' }));
    setResult(null);
  };

  const handleMobileTabSwitch = (view) => {
    setMobileView(view);
    if (view === 'problem') {
      setActiveTab('description');
    } else if (view === 'results') {
      setActiveTab('results');
    } else if (view === 'editor') {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 50);
    }
  };

  // ── Run (visible tests only, no auth needed) ───────────────────────────────
  const handleRun = async () => {
    if (!activeCode.trim()) return toast.error('Please write some code first.');
    setRunning(true);
    setResult(null);
    try {
      const res = await challengeService.run(challenge._id, { code: activeCode, language });
      const data = res.data.data;
      setResult({ ...data, isRun: true });
      setActiveTab('results');
      setMobileView('results');
      if (data.allPassed) toast.success('All visible tests passed! 🎉');
      else toast.error('Some tests failed. Check the results.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Run failed');
    } finally {
      setRunning(false);
    }
  };

  // ── Submit (all tests, saves submission) ───────────────────────────────────
  const handleSubmit = async () => {
    if (!user) return toast.error('Please sign in to submit');
    if (!activeCode.trim()) return toast.error('Please write some code first.');
    setSubmitting(true);
    setResult(null);
    try {
      const res = await challengeService.submit(challenge._id, { code: activeCode, language });
      const data = res.data.data;
      setResult({ ...data, isRun: false });
      setActiveTab('results');
      setMobileView('results');
      if (data.allPassed) toast.success(`🏆 All tests passed! +${data.xpResult?.xpEarned || challenge.xpReward} XP`);
      else toast.error('Some tests failed. Keep trying!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="page-container">
      <div className="skeleton" style={{ height: 60, marginBottom: '1rem' }} />
      <div className="challenge-detail-layout">
        <div className="skeleton" style={{ height: 500 }} />
        <div className="skeleton" style={{ height: 500 }} />
      </div>
    </div>
  );

  if (!challenge) return (
    <div className="page-container">
      <div className="empty-state"><h3>Challenge not found</h3></div>
    </div>
  );

  const diffColors = { beginner: 'var(--color-success)', intermediate: 'var(--color-warning)', advanced: 'var(--color-danger)', expert: '#9b59b6' };
  const diffColor = diffColors[challenge.difficulty] || 'var(--accent-primary)';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">

      {/* ── Header ── */}
      <div className="flex justify-between items-center mb-lg challenge-detail-header">
        <div style={{ maxWidth: '100%' }}>
          <div className="flex items-center gap-sm mb-sm" style={{ flexWrap: 'wrap' }}>
            <span style={{ textTransform: 'capitalize', background: `${diffColor}18`, border: `1px solid ${diffColor}40`, color: diffColor, padding: '0.2rem 0.7rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
              {challenge.difficulty}
            </span>
            <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{challenge.category}</span>
            <span style={{ color: 'var(--xp-gold)', fontWeight: 700, fontSize: '0.875rem' }}>⚡ {challenge.xpReward} XP</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', margin: 0, wordBreak: 'break-word' }}>{challenge.title}</h1>
        </div>

        {/* Language Selector */}
        <div className="flex gap-sm challenge-lang-selector">
          {['javascript', 'python'].map(lang => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className="challenge-lang-btn"
              style={{
                padding: '0.45rem 1rem', borderRadius: '100px', fontWeight: 600, cursor: 'pointer',
                border: language === lang ? `1px solid ${diffColor}80` : '1px solid rgba(255,255,255,0.1)',
                background: language === lang ? `${diffColor}18` : 'var(--bg-secondary)',
                color: language === lang ? diffColor : 'var(--text-secondary)',
                transition: 'all 0.2s',
                fontSize: '0.85rem',
                minHeight: '40px'
              }}
            >
              {LANG_ICONS[lang]} {LANG_LABELS[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Mobile View Switcher (Visible only on screens <= 768px) ── */}
      <div className="challenge-mobile-nav mobile-only">
        <button
          onClick={() => handleMobileTabSwitch('problem')}
          className={`challenge-mobile-nav-btn ${mobileView === 'problem' ? 'active' : ''}`}
        >
          📋 Problem
        </button>
        <button
          onClick={() => handleMobileTabSwitch('editor')}
          className={`challenge-mobile-nav-btn ${mobileView === 'editor' ? 'active' : ''}`}
        >
          💻 Code
        </button>
        <button
          onClick={() => handleMobileTabSwitch('results')}
          className={`challenge-mobile-nav-btn ${mobileView === 'results' ? 'active' : ''}`}
        >
          {result ? (result.allPassed ? '✅ Results' : '❌ Results') : '📊 Results'}
          {result && <span className="challenge-result-indicator" />}
        </button>
      </div>

      {/* ── Main Layout ── */}
      <div className="challenge-detail-layout">

        {/* ── Left Panel: Description / Results ── */}
        <div className={`card challenge-panel-problem ${mobileView !== 'editor' ? 'mobile-visible' : ''}`} style={{ padding: 0, overflow: 'hidden' }}>
          {/* Tabs */}
          <div className="flex desktop-only" style={{ borderBottom: '1px solid var(--border-primary)' }}>
            {[
              { id: 'description', label: '📋 Problem' },
              { id: 'results',     label: result ? (result.allPassed ? '✅ Results' : '❌ Results') : '📊 Results' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1, padding: '0.85rem', border: 'none', background: 'transparent',
                  color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  borderBottom: activeTab === tab.id ? `2px solid ${diffColor}` : '2px solid transparent',
                  cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.9rem',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="challenge-description-content">
            <AnimatePresence mode="wait">
              {activeTab === 'description' ? (
                <motion.div key="desc" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                    <ChatMarkdown>{challenge.description}</ChatMarkdown>
                  </div>

                  {/* Visible test cases */}
                  {challenge.testCases?.filter(tc => !tc.isHidden).length > 0 && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <h4 style={{ marginBottom: '0.75rem', color: 'var(--text-primary)' }}>📝 Examples</h4>
                      {challenge.testCases.filter(tc => !tc.isHidden).map((tc, i) => (
                        <div key={i} className="challenge-example-box">
                          <p style={{ marginBottom: '0.3rem', wordBreak: 'break-word' }}>
                            <span style={{ color: 'var(--text-tertiary)', fontWeight: 600 }}>Input: </span> 
                            <code style={{ color: 'var(--accent-primary)', wordBreak: 'break-all' }}>{tc.input}</code>
                          </p>
                          <p style={{ wordBreak: 'break-word', margin: 0 }}>
                            <span style={{ color: 'var(--text-tertiary)', fontWeight: 600 }}>Output: </span> 
                            <code style={{ color: 'var(--color-success)', wordBreak: 'break-all' }}>{tc.expectedOutput}</code>
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Hints */}
                  {challenge.hints?.length > 0 && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <h4 style={{ marginBottom: '0.5rem' }}>💡 Hints</h4>
                      {challenge.hints.map((h, i) => (
                        <p key={i} className="text-sm" style={{ color: 'var(--text-muted)', marginBottom: '0.4rem', paddingLeft: '0.75rem', borderLeft: `2px solid ${diffColor}60` }}>
                          {h}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Quick Jump to Code Editor on Mobile */}
                  <div className="mobile-only" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-primary)' }}>
                    <button
                      onClick={() => handleMobileTabSwitch('editor')}
                      className="btn btn-primary"
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', minHeight: 44, fontWeight: 700 }}
                    >
                      💻 Start Coding ▶
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="results" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  {!result ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-tertiary)' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⌛</div>
                      <p>Run or Submit your code to see results here.</p>
                      <button
                        onClick={() => handleMobileTabSwitch('editor')}
                        className="btn btn-primary"
                        style={{ marginTop: '1rem', minHeight: 40 }}
                      >
                        Go to Editor
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Summary */}
                      <div style={{
                        padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem',
                        background: result.allPassed ? 'rgba(0,184,148,0.1)' : 'rgba(255,71,87,0.1)',
                        border: `1px solid ${result.allPassed ? 'var(--color-success)' : 'var(--color-danger)'}40`
                      }}>
                        <h3 style={{ color: result.allPassed ? 'var(--color-success)' : 'var(--color-danger)', marginBottom: '0.25rem', fontSize: '1.1rem', wordBreak: 'break-word' }}>
                          {result.allPassed ? '✅ All Tests Passed!' : '❌ Some Tests Failed'}
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                          {result.isRun ? 'Visible test cases only — Submit to save your score.' : 'Full test suite evaluated.'}
                        </p>
                        {result.xpResult && (
                          <p style={{ color: 'var(--xp-gold)', fontWeight: 700, marginTop: '0.4rem', marginBottom: 0 }}>
                            ⚡ +{result.xpResult.xpEarned} XP earned!
                          </p>
                        )}
                      </div>

                      {/* Per-test results */}
                      {(result.testResults || result.submission?.testResults)?.map((tr, i) => (
                        <div key={i} style={{
                          marginBottom: '0.75rem', borderRadius: 'var(--radius-sm)',
                          border: `1px solid ${tr.passed ? 'rgba(0,184,148,0.3)' : 'rgba(255,71,87,0.3)'}`,
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            flexWrap: 'wrap', gap: '0.5rem',
                            padding: '0.6rem 0.85rem',
                            background: tr.passed ? 'rgba(0,184,148,0.08)' : 'rgba(255,71,87,0.08)'
                          }}>
                            <span style={{ fontWeight: 600, fontSize: '0.85rem', color: tr.passed ? 'var(--color-success)' : 'var(--color-danger)' }}>
                              {tr.passed ? '✅' : '❌'} Test Case {i + 1}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{tr.executionTime}ms</span>
                          </div>
                          {tr.output && (
                            <pre style={{
                              margin: 0, padding: '0.75rem 0.85rem',
                              fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
                              color: tr.passed ? 'var(--color-success)' : 'var(--color-danger)',
                              background: 'rgba(0,0,0,0.2)', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                              maxWidth: '100%', overflowX: 'auto'
                            }}>
                              {tr.output}
                            </pre>
                          )}
                        </div>
                      ))}

                      {/* Quick Jump back to Editor on Mobile */}
                      <div className="mobile-only" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-primary)' }}>
                        <button
                          onClick={() => handleMobileTabSwitch('editor')}
                          className="btn btn-secondary"
                          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', minHeight: 44, fontWeight: 700 }}
                        >
                          💻 Back to Code Editor
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Right Panel: Editor + Actions ── */}
        <div className={`challenge-panel-editor ${mobileView === 'editor' ? 'mobile-visible' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Editor Card */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Editor header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-primary)' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {LANG_ICONS[language]} {LANG_LABELS[language]}
              </span>
              <button onClick={handleReset} style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                🔄 Reset
              </button>
            </div>

            <div className="challenge-editor-wrapper">
              <Editor
                height="100%"
                language={language}
                theme="vs-dark"
                value={activeCode}
                onChange={handleEditorChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                  lineHeight: 1.6,
                  padding: { top: 12, bottom: 12 },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  cursorBlinking: 'smooth',
                  bracketPairColorization: { enabled: true },
                  suggest: { showKeywords: true },
                  tabSize: language === 'python' ? 4 : 2,
                  wordWrap: 'on',
                  automaticLayout: true,
                  lineNumbersMinChars: 3,
                  glyphMargin: false,
                  folding: false,
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="challenge-actions-grid">
            <button
              onClick={handleRun}
              disabled={running || submitting}
              className="challenge-btn-run"
            >
              {running ? (
                <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span> Running...</>
              ) : (
                <>▶ Run Code</>
              )}
            </button>

            <button
              onClick={handleSubmit}
              disabled={running || submitting}
              className="challenge-btn-submit"
            >
              {submitting ? (
                <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span> Submitting...</>
              ) : (
                <>🚀 Submit Solution</>
              )}
            </button>
          </div>

          {/* Info Bar */}
          <div className="challenge-info-bar">
            <span>▶ Run = visible tests only</span>
            <span>•</span>
            <span>🚀 Submit = all tests + save score</span>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
}
