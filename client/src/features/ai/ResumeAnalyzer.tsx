import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { aiService } from '@/services';

export function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
      } else {
        toast.error('Please upload a PDF file.');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    
    try {
      const response = await aiService.analyzeResume(file);
      setResults(response.data.data.analysis);
      toast.success('Resume analyzed successfully!');
    } catch (error) {
      toast.error('Failed to analyze resume. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-sm mb-lg">
        <span style={{ fontSize: '1.5rem' }}>📄</span>
        <h3>AI Resume Analyzer</h3>
      </div>
      <p className="text-muted text-sm mb-xl">
        Upload your PDF resume to get an instant ATS score and keyword analysis from our AI Recruiter.
      </p>

      {!results ? (
        <>
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragging ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
              borderRadius: '12px',
              padding: '3rem',
              textAlign: 'center',
              cursor: 'pointer',
              background: isDragging ? 'var(--bg-hover)' : 'var(--bg-secondary)',
              transition: 'all 0.2s ease',
              marginBottom: '1.5rem'
            }}
          >
            <input 
              type="file" 
              accept="application/pdf" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileSelect} 
            />
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📥</span>
            <p className="font-bold mb-sm">{file ? file.name : 'Drag & Drop your resume here'}</p>
            <p className="text-sm text-muted">or click to browse (PDF only, max 5MB)</p>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-primary" 
            style={{ width: '100%' }}
            disabled={!file || isAnalyzing}
            onClick={handleAnalyze}
          >
            {isAnalyzing ? 'Scanning Document...' : 'Analyze Resume'}
          </motion.button>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-between items-center mb-xl">
            <h4>Analysis Complete</h4>
            <button className="btn btn-ghost btn-sm" onClick={() => setResults(null)}>Scan Another</button>
          </div>

          <div className="grid grid-2 mb-xl" style={{ gap: '1rem' }}>
            <div className="card" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>
              <p className="text-muted text-sm mb-sm">ATS Match Score</p>
              <div className="flex items-center gap-sm">
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: results.score >= 80 ? 'var(--color-success)' : results.score >= 60 ? 'var(--color-warning)' : 'var(--color-danger)' }}>
                  {results.score}
                </span>
                <span className="text-muted">/ 100</span>
              </div>
            </div>
            <div className="card" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>
              <p className="text-muted text-sm mb-sm">Overall Impression</p>
              <p className="text-sm" style={{ lineHeight: 1.6 }}>{results.summary}</p>
            </div>
          </div>

          <div className="mb-xl">
            <h4 className="mb-sm flex items-center gap-sm"><span style={{ color: 'var(--color-danger)' }}>⚠️</span> Missing Keywords</h4>
            <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
              {results.missingKeywords.map((kw: string, i: number) => (
                <span key={i} style={{ padding: '0.25rem 0.75rem', background: 'var(--color-danger-bg)', color: 'var(--color-danger)', borderRadius: '20px', fontSize: '0.8rem', border: '1px solid rgba(255,107,107,0.2)' }}>
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-sm flex items-center gap-sm"><span style={{ color: 'var(--accent-secondary)' }}>💡</span> Improvement Suggestions</h4>
            <ul style={{ listStylePosition: 'inside', padding: 0 }}>
              {results.suggestions.map((sug: string, i: number) => (
                <li key={i} className="text-sm mb-sm" style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '8px', borderLeft: '3px solid var(--accent-secondary)' }}>
                  {sug}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
}
