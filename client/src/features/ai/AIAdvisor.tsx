import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResumeAnalyzer } from './ResumeAnalyzer';
import { CareerMentor } from './CareerMentor';

export default function AIAdvisor() {
  const [activeTab, setActiveTab] = useState<'resume' | 'career'>('career');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="page-header mb-xl">
        <h1>🤖 AI Tech Hub</h1>
        <p className="text-muted">Powered by Google Gemini — Accelerate your career growth</p>
      </div>

      <div className="flex gap-sm mb-lg" style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: '1rem' }}>
        <button 
          className={`btn ${activeTab === 'career' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('career')}
          style={{ flex: 1 }}
        >
          Career Roadmap Generator
        </button>
        <button 
          className={`btn ${activeTab === 'resume' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('resume')}
          style={{ flex: 1 }}
        >
          ATS Resume Analyzer
        </button>
      </div>

      <div style={{ position: 'relative', minHeight: '60vh' }}>
        <AnimatePresence mode="wait">
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
