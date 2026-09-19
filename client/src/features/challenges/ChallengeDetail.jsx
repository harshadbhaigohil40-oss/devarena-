import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { challengeService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { useThemeStore } from '../theme/useThemeStore';
import toast from 'react-hot-toast';
import ChatMarkdown from '@/components/ui/ChatMarkdown';
import Editor from '@monaco-editor/react';

const LANG_LABELS = { javascript: 'JavaScript', python: 'Python', html: 'HTML' };
const LANG_ICONS  = { javascript: '🟨', python: '🐍', html: '🌐' };

export default function ChallengeDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { theme } = useThemeStore();
  const [language, setLanguage]       = useState('javascript');
  const [userCode, setUserCode]       = useState({ javascript: '', python: '', html: '' });
  const [result, setResult]           = useState(null);
  const [running, setRunning]         = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [activeTab, setActiveTab]     = useState('description'); // 'description' | 'preview' | 'results'
  const [mobileView, setMobileView]   = useState('problem'); // 'problem' | 'editor' | 'preview' | 'results'

  // Monaco Editor Resizing & Customization States
  const editorRef = useRef(null);
  const layoutContainerRef = useRef(null);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);

  const getDefaultHeight = () => {
    if (typeof window === 'undefined') return 460;
    if (window.innerWidth < 480) return 330;
    if (window.innerWidth < 768) return 390;
    return 460;
  };

  const [editorHeight, setEditorHeight] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('devarena_editor_height');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 220 && parsed <= 1200) return parsed;
      }
      return getDefaultHeight();
    }
    return 460;
  });

  const [editorFontSize, setEditorFontSize] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('devarena_editor_fontsize');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 11 && parsed <= 24) return parsed;
      }
    }
    return 13;
  });

  const [splitRatio, setSplitRatio] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('devarena_editor_split');
      if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed >= 25 && parsed <= 75) return parsed;
      }
    }
    return 50;
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDraggingHeight, setIsDraggingHeight] = useState(false);
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);

  const { data: challenge, isLoading: loading } = useQuery({
    queryKey: ['challenge', slug],
    queryFn: async () => {
      const res = await challengeService.get(slug);
      return res.data.data.challenge;
    }
  });

  // Detect if this is a frontend question that should show the HTML language tab
  const isFrontendHtmlQuestion = challenge?.category === 'frontend';

  const availableLanguages = isFrontendHtmlQuestion
    ? ['javascript', 'python', 'html']
    : ['javascript', 'python'];

  useEffect(() => {
    if (challenge?.starterCode) {
      const defaultHtml = challenge.starterCode.html || (isFrontendHtmlQuestion ? `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>${challenge.title || 'Page'}</title>\n</head>\n<body>\n  <!-- Write your HTML structure here -->\n\n</body>\n</html>\n` : '');
      setUserCode({
        javascript: challenge.starterCode.javascript || '// Write your solution here\n',
        python: challenge.starterCode.python || '# Write your solution here\n',
        html: defaultHtml,
      });
      setResult(null);
    }
  }, [challenge, isFrontendHtmlQuestion]);

  useEffect(() => {
    if (language === 'html' && !isFrontendHtmlQuestion) {
      setLanguage('javascript');
    }
  }, [isFrontendHtmlQuestion, language]);

  // Handle Fullscreen Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        setTimeout(() => editorRef.current?.layout(), 100);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Vertical Dragging (Height)
  const startHeightDrag = (e) => {
    e.preventDefault();
    setIsDraggingHeight(true);
    const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;
    dragStartY.current = clientY;
    dragStartHeight.current = editorHeight;
  };

  useEffect(() => {
    if (!isDraggingHeight) return;

    const onMove = (e) => {
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);
      if (clientY === undefined) return;
      const delta = clientY - dragStartY.current;
      const minH = 220;
      const maxH = Math.max(minH, window.innerHeight - 140);
      const newHeight = Math.max(minH, Math.min(maxH, dragStartHeight.current + delta));
      setEditorHeight(newHeight);
      editorRef.current?.layout();
    };

    const onEnd = () => {
      setIsDraggingHeight(false);
      setEditorHeight((current) => {
        try {
          localStorage.setItem('devarena_editor_height', String(current));
        } catch (err) {}
        return current;
      });
      editorRef.current?.layout();
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDraggingHeight]);

  // Horizontal Dragging (Split ratio on desktop)
  const startSplitDrag = (e) => {
    e.preventDefault();
    setIsDraggingSplit(true);
  };

  useEffect(() => {
    if (!isDraggingSplit) return;

    const onMove = (e) => {
      if (!layoutContainerRef.current) return;
      const rect = layoutContainerRef.current.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      if (clientX === undefined) return;
      const offsetX = clientX - rect.left;
      const percentage = (offsetX / rect.width) * 100;
      const clamped = Math.max(28, Math.min(72, Math.round(percentage * 10) / 10));
      setSplitRatio(clamped);
      editorRef.current?.layout();
    };

    const onEnd = () => {
      setIsDraggingSplit(false);
      setSplitRatio((current) => {
        try {
          localStorage.setItem('devarena_editor_split', String(current));
        } catch (err) {}
        return current;
      });
      editorRef.current?.layout();
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
    };
  }, [isDraggingSplit]);

  const adjustHeight = (delta) => {
    setEditorHeight(h => {
      const next = Math.max(220, Math.min(950, h + delta));
      try { localStorage.setItem('devarena_editor_height', String(next)); } catch (err) {}
      setTimeout(() => editorRef.current?.layout(), 50);
      return next;
    });
  };

  const adjustFontSize = (delta) => {
    setEditorFontSize(fs => {
      const next = Math.max(11, Math.min(22, fs + delta));
      try { localStorage.setItem('devarena_editor_fontsize', String(next)); } catch (err) {}
      return next;
    });
  };

  const resetHeight = () => {
    const def = getDefaultHeight();
    setEditorHeight(def);
    try { localStorage.setItem('devarena_editor_height', String(def)); } catch (err) {}
    setTimeout(() => editorRef.current?.layout(), 50);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(prev => {
      const next = !prev;
      setTimeout(() => editorRef.current?.layout(), 100);
      return next;
    });
  };

  const activeCode = userCode[language] || '';

  const handleEditorChange = (value) =>
    setUserCode(prev => ({ ...prev, [language]: value || '' }));

  const handleReset = () => {
    const defaultHtml = challenge?.starterCode?.html || (isFrontendHtmlQuestion ? `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>${challenge?.title || 'Page'}</title>\n</head>\n<body>\n  <!-- Write your HTML structure here -->\n\n</body>\n</html>\n` : '');
    const defaultCode = challenge?.starterCode?.[language] || (language === 'html' ? defaultHtml : '');
    setUserCode(prev => ({ ...prev, [language]: defaultCode }));
    setResult(null);
  };

  const handleMobileTabSwitch = (view) => {
    setMobileView(view);
    if (view === 'problem') {
      setActiveTab('description');
    } else if (view === 'preview') {
      setActiveTab('preview');
    } else if (view === 'results') {
      setActiveTab('results');
    } else if (view === 'editor') {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
        editorRef.current?.layout();
      }, 60);
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
      const rawResults = data.results || data.testResults || [];
      const passedCount = data.passedCount ?? rawResults.filter(r => r.passed).length;
      const totalCount = data.totalCount ?? rawResults.length;
      setResult({
        ...data,
        results: rawResults,
        testResults: rawResults,
        passedCount,
        totalCount,
        isRun: true
      });
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
      const rawResults = data.results || data.testResults || data.submission?.testResults || [];
      const passedCount = data.passedCount ?? rawResults.filter(r => r.passed).length;
      const totalCount = data.totalCount ?? rawResults.length;
      setResult({
        ...data,
        results: rawResults,
        testResults: rawResults,
        passedCount,
        totalCount,
        isRun: false
      });
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
          {availableLanguages.map(lang => (
            <button
              key={lang}
              onClick={() => {
                setLanguage(lang);
                setTimeout(() => editorRef.current?.layout(), 50);
              }}
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
        {language === 'html' && (
          <button
            onClick={() => handleMobileTabSwitch('preview')}
            className={`challenge-mobile-nav-btn ${mobileView === 'preview' ? 'active' : ''}`}
          >
            👁️ Preview
          </button>
        )}
        <button
          onClick={() => handleMobileTabSwitch('results')}
          className={`challenge-mobile-nav-btn ${mobileView === 'results' ? 'active' : ''}`}
        >
          {result ? (result.allPassed ? '✅ Results' : '❌ Results') : '📊 Results'}
          {result && <span className="challenge-result-indicator" />}
        </button>
      </div>

      {/* ── Main Layout with Resizable Panels ── */}
      <div 
        ref={layoutContainerRef}
        className="challenge-detail-layout has-splitter"
        style={{
          '--split-left': `${splitRatio}%`,
          '--split-right': `${100 - splitRatio}%`,
          '--editor-height': `${editorHeight}px`
        }}
      >

        {/* ── Left Panel: Description / Results ── */}
        <div className={`card challenge-panel-problem ${mobileView !== 'editor' ? 'mobile-visible' : ''}`} style={{ padding: 0, overflow: 'hidden' }}>
          {/* Tabs */}
          <div className="flex desktop-only" style={{ borderBottom: '1px solid var(--border-primary)' }}>
            {[
              { id: 'description', label: '📋 Problem' },
              ...(language === 'html' ? [{ id: 'preview', label: '👁️ Live Preview' }] : []),
              { id: 'results',     label: result ? (result.allPassed ? '✅ Results' : '❌ Results') : '📊 Results' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                style={{ borderRadius: 0, borderBottom: activeTab === tab.id ? '2px solid var(--accent-primary)' : 'none', padding: '0.85rem 1.25rem', fontWeight: 600, fontSize: '0.9rem' }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ padding: '1.25rem', maxHeight: '70dvh', overflowY: 'auto' }}>
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
                          {tc.explanation && (
                            <p className="text-muted text-sm" style={{ marginTop: '0.4rem', borderTop: '1px solid var(--border-primary)', paddingTop: '0.4rem' }}>
                              {tc.explanation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Hints */}
                  {challenge.hints?.length > 0 && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <h4 style={{ marginBottom: '0.75rem', color: 'var(--text-primary)' }}>💡 Hints</h4>
                      {challenge.hints.map((hint, i) => (
                        <details key={i} style={{ marginBottom: '0.5rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '0.75rem', border: '1px solid var(--border-primary)', cursor: 'pointer' }}>
                          <summary style={{ fontWeight: 600, color: 'var(--accent-secondary)' }}>Hint {i + 1}</summary>
                          <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{hint}</p>
                        </details>
                      ))}
                    </div>
                  )}

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
                </motion.div>
              ) : activeTab === 'preview' ? (
                <motion.div key="preview" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>🌐</span>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Live HTML Preview</h4>
                        <span className="text-muted text-sm">Real-time rendered DOM output</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', borderRadius: '4px', border: '1px solid rgba(99, 102, 241, 0.2)', fontWeight: 600 }}>
                      Interactive Sandbox
                    </span>
                  </div>
                  <div style={{
                    background: '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-primary)',
                    minHeight: 'clamp(280px, 50dvh, 400px)',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
                  }}>
                    <iframe
                      title="HTML Preview Sandbox"
                      srcDoc={activeCode}
                      sandbox="allow-scripts allow-same-origin"
                      style={{ width: '100%', flex: 1, minHeight: '380px', border: 'none', background: '#ffffff', display: 'block' }}
                    />
                  </div>
                  <div className="mobile-only" style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-primary)' }}>
                    <button
                      onClick={() => handleMobileTabSwitch('editor')}
                      className="btn btn-secondary"
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', minHeight: 44, fontWeight: 700 }}
                    >
                      💻 Back to Code Editor
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* Results tab */
                <motion.div key="results" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  {!result ? (
                    <div className="empty-state" style={{ padding: '2rem' }}>
                      <p>Run your code to see results here.</p>
                    </div>
                  ) : (
                    <>
                      {/* Overall summary */}
                      <div style={{
                        padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem',
                        background: result.allPassed ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        border: `1px solid ${result.allPassed ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                        display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap'
                      }}>
                        <span style={{ fontSize: '1.5rem' }}>{result.allPassed ? '🎉' : '❌'}</span>
                        <div style={{ flex: 1, minWidth: '160px' }}>
                          <h4 style={{ margin: 0, color: result.allPassed ? 'var(--color-success)' : 'var(--color-danger)' }}>
                            {result.allPassed ? 'All Tests Passed!' : 'Tests Failed'}
                          </h4>
                          <span className="text-muted text-sm">
                            {result.passedCount} / {result.totalCount} test cases passed
                            {result.isRun ? ' (visible only)' : ''}
                          </span>
                        </div>
                        {result.xpResult && (
                          <div style={{ color: 'var(--xp-gold)', fontWeight: 800, fontSize: '1rem' }}>
                            +{result.xpResult.xpEarned} XP
                          </div>
                        )}
                      </div>

                      {/* Execution error */}
                      {result.error && (
                        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--color-danger)', display: 'block', marginBottom: '0.25rem' }}>Runtime Error:</span>
                          <pre style={{ color: 'var(--color-danger)', fontSize: '0.8rem', whiteSpace: 'pre-wrap', margin: 0 }}>{result.error}</pre>
                        </div>
                      )}

                      {/* Individual test results */}
                      {(result.results || result.testResults || []).map((tc, i) => (
                        <div key={i} style={{
                          padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '0.6rem',
                          background: 'var(--bg-tertiary)',
                          borderLeft: `4px solid ${tc.passed ? 'var(--color-success)' : 'var(--color-danger)'}`,
                          border: '1px solid var(--border-primary)',
                          borderLeftWidth: '4px',
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.25rem' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                              Test {i + 1} {tc.isHidden ? '(Hidden)' : ''}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {tc.executionTime !== undefined && (
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{tc.executionTime}ms</span>
                              )}
                              <span style={{
                                fontSize: '0.75rem', fontWeight: 700,
                                color: tc.passed ? 'var(--color-success)' : 'var(--color-danger)',
                              }}>
                                {tc.passed ? 'PASSED' : 'FAILED'}
                              </span>
                            </div>
                          </div>

                          {!tc.isHidden && (tc.input || tc.expectedOutput || tc.actualOutput) ? (
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                              {tc.input && <div><span className="text-muted">Input: </span><code style={{ wordBreak: 'break-all' }}>{tc.input}</code></div>}
                              {tc.expectedOutput && <div><span className="text-muted">Expected: </span><code style={{ color: 'var(--color-success)', wordBreak: 'break-all' }}>{tc.expectedOutput}</code></div>}
                              {!tc.passed && tc.actualOutput && (
                                <div><span className="text-muted">Got: </span><code style={{ color: 'var(--color-danger)', wordBreak: 'break-all' }}>{tc.actualOutput}</code></div>
                              )}
                            </div>
                          ) : tc.output ? (
                            <pre style={{ margin: 0, padding: '0.5rem 0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: tc.passed ? 'var(--color-success)' : 'var(--color-danger)', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                              {tc.output}
                            </pre>
                          ) : null}
                          {tc.error && (
                            <p style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.3rem', margin: 0 }}>{tc.error}</p>
                          )}
                        </div>
                      ))}

                      {/* Visual Output for HTML Challenges */}
                      {language === 'html' && activeCode && (
                        <div style={{ marginTop: '1.5rem' }}>
                          <h4 style={{ marginBottom: '0.75rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.2rem' }}>👁️</span> Rendered Output
                          </h4>
                          <div style={{
                            background: '#ffffff',
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                            border: '1px solid var(--border-primary)',
                            minHeight: '300px',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
                          }}>
                            <iframe
                              title="HTML Result Render"
                              srcDoc={activeCode}
                              sandbox="allow-scripts allow-same-origin"
                              style={{ width: '100%', flex: 1, minHeight: '300px', border: 'none', background: '#ffffff', display: 'block' }}
                            />
                          </div>
                        </div>
                      )}

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

        {/* ── Desktop Splitter Handle (Col-resize divider between panels) ── */}
        <div 
          className={`challenge-horizontal-resizer desktop-only ${isDraggingSplit ? 'active' : ''}`}
          onMouseDown={startSplitDrag}
          title="Drag left/right to resize panels (Double-click to reset 50/50)"
          onDoubleClick={() => {
            setSplitRatio(50);
            try { localStorage.setItem('devarena_editor_split', '50'); } catch (e) {}
            setTimeout(() => editorRef.current?.layout(), 50);
          }}
        />

        {/* ── Right Panel: Editor + Actions ── */}
        <div className={`challenge-panel-editor ${mobileView === 'editor' ? 'mobile-visible' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Editor Card with Dynamic Resizing & Fullscreen */}
          <div className={`card ${isFullscreen ? 'editor-card-fullscreen' : ''}`} style={{ padding: 0, overflow: 'hidden' }}>
            {/* Editor Toolbar with Sizing Controls */}
            <div className="challenge-editor-toolbar">
              <div className="challenge-editor-toolbar-left">
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {LANG_ICONS[language]} {LANG_LABELS[language]}
                </span>
                {isFullscreen && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '0.75rem' }}>
                    {challenge?.title}
                  </span>
                )}
                <button 
                  type="button"
                  onClick={handleReset} 
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, padding: '2px 6px', borderRadius: '4px' }}
                  title="Reset code to starter template"
                >
                  🔄 Reset
                </button>
              </div>

              <div className="challenge-editor-toolbar-right">
                {/* Font Size Scaling Controls */}
                <div className="editor-ctrl-group" title="Adjust code font size">
                  <button 
                    type="button" 
                    className="editor-ctrl-btn" 
                    onClick={() => adjustFontSize(-1)}
                    disabled={editorFontSize <= 11}
                    aria-label="Decrease font size"
                  >
                    A−
                  </button>
                  <span className="editor-ctrl-label">{editorFontSize}px</span>
                  <button 
                    type="button" 
                    className="editor-ctrl-btn" 
                    onClick={() => adjustFontSize(1)}
                    disabled={editorFontSize >= 22}
                    aria-label="Increase font size"
                  >
                    A+
                  </button>
                </div>

                {/* Fullscreen / Focus Mode Toggle */}
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={toggleFullscreen}
                  style={{ 
                    padding: '0.25rem 0.55rem', 
                    fontSize: '0.8rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.35rem', 
                    borderRadius: 'var(--radius-md)', 
                    background: isFullscreen ? 'rgba(138, 43, 226, 0.2)' : 'rgba(255,255,255,0.04)', 
                    color: isFullscreen ? '#fff' : 'var(--text-secondary)' 
                  }}
                  title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Maximize Editor (Focus Mode)'}
                >
                  {isFullscreen ? (
                    <><span>⤓</span> <span>Exit Focus</span></>
                  ) : (
                    <><span>⛶</span> <span className="desktop-only">Focus</span></>
                  )}
                </button>
              </div>
            </div>

            {/* Monaco Editor Container */}
            <div className="challenge-editor-wrapper" style={{ height: isFullscreen ? '100%' : `${editorHeight}px` }}>
              <Editor
                height="100%"
                language={language}
                theme={theme === 'light' ? 'light' : 'vs-dark'}
                value={activeCode}
                onChange={handleEditorChange}
                onMount={(editor) => {
                  editorRef.current = editor;
                }}
                options={{
                  minimap: { enabled: isFullscreen },
                  fontSize: editorFontSize,
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
                  folding: true,
                }}
              />
            </div>

            {/* Draggable Bottom Height Resizer Handle */}
            {!isFullscreen && (
              <div
                className={`challenge-editor-resize-handle ${isDraggingHeight ? 'active' : ''}`}
                onMouseDown={startHeightDrag}
                onTouchStart={startHeightDrag}
                title="Drag up or down to resize editor height • Double-click to reset"
                onDoubleClick={resetHeight}
              >
                <div className="resize-handle-bar">
                  <span className="resize-handle-icon">⠿</span>
                  <span className="resize-handle-text">Drag to resize ({editorHeight}px)</span>
                </div>
              </div>
            )}

            {/* In Fullscreen mode: integrated action bar */}
            {isFullscreen && (
              <div style={{ padding: '0.75rem 1.5rem', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div className="text-sm text-muted">
                  Press <kbd style={{ padding: '0.2rem 0.4rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '0.75rem' }}>Esc</kbd> to exit fullscreen
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={handleRun} disabled={running || submitting} className="btn btn-secondary btn-sm" style={{ minHeight: 38 }}>
                    {running ? '⟳ Running...' : '▶ Run Code'}
                  </button>
                  <button onClick={handleSubmit} disabled={running || submitting} className="btn btn-primary btn-sm" style={{ minHeight: 38 }}>
                    {submitting ? '⟳ Submitting...' : '🚀 Submit Solution'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons (visible in normal view) */}
          {!isFullscreen && (
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
          )}

          {/* Info Bar */}
          {!isFullscreen && (
            <div className="challenge-info-bar">
              <span>▶ Run = visible tests only</span>
              <span>•</span>
              <span>🚀 Submit = all tests + save score</span>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
}
