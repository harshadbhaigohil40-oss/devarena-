import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { ResumeAnalyzer } from './ResumeAnalyzer';
import { CareerMentor } from './CareerMentor';
import Leaderboard from '@/pages/Leaderboard';

type AdvisorTab = 'leaderboard' | 'career' | 'resume';

export default function AIAdvisor() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as AdvisorTab | null;
  const initialTab: AdvisorTab = (tabParam && ['leaderboard', 'career', 'resume'].includes(tabParam)) 
    ? tabParam 
    : 'leaderboard';

  const [activeTab, setActiveTab] = useState<AdvisorTab>(initialTab);

  const handleTabChange = (tab: AdvisorTab) => {
    setActiveTab(tab);
    setSearchParams(tab === 'leaderboard' ? {} : { tab });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container" style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div className="page-header mb-xl">
        <h1 data-testid="ai-advisor-title">🤖 AI Career Advisor</h1>
        <p className="text-muted">Powered by Google Gemini — Personalized Mentorship & Advisor Leaderboard</p>
      </div>

      <div className="flex gap-sm mb-lg" style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: '1rem', flexWrap: 'wrap' }}>
        <button 
          className={`btn btn-wrap ${activeTab === 'leaderboard' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => handleTabChange('leaderboard')}
          style={{ flex: '1 1 180px', minHeight: 44 }}
          data-testid="tab-advisor-leaderboard"
        >
          🏆 Advisor Leaderboard
        </button>
        <button 
          className={`btn btn-wrap ${activeTab === 'career' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => handleTabChange('career')}
          style={{ flex: '1 1 180px', minHeight: 44 }}
          data-testid="tab-career-roadmap"
        >
          🧭 Career Roadmap Generator
        </button>
        <button 
          className={`btn btn-wrap ${activeTab === 'resume' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => handleTabChange('resume')}
          style={{ flex: '1 1 180px', minHeight: 44 }}
          data-testid="tab-resume-analyzer"
        >
          📄 ATS Resume Analyzer
        </button>
      </div>

      <div style={{ position: 'relative', minHeight: '60vh' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="advisor-leaderboard-container"
              data-testid="advisor-leaderboard-container"
            >
              <Leaderboard 
                title="Advisor Leaderboard"
                subtitle="The top performing architects and AI-evaluated engineers of the DevArena ecosystem."
                isAdvisor={true}
                embedded={true}
              />
            </motion.div>
          )}

          {activeTab === 'career' && (
            <motion.div
              key="career"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <CareerMentor />
            </motion.div>
          )}

          {activeTab === 'resume' && (
            <motion.div
              key="resume"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <ResumeAnalyzer />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

