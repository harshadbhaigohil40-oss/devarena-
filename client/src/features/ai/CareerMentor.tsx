import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { aiService } from '@/services';

export function CareerMentor() {
  const [currentSkills, setCurrentSkills] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);

  const handleGenerate = async () => {
    if (!currentSkills || !targetRole) {
      toast.error('Please fill in both fields.');
      return;
    }

    setIsGenerating(true);
    try {
      const skillsArray = currentSkills.split(',').map(s => s.trim());
      const response = await aiService.generateRoadmap({ currentSkills: skillsArray, targetRole });
      setRoadmap(response.data.data.roadmap);
      toast.success('Roadmap generated successfully!');
    } catch (error) {
      toast.error('Failed to generate roadmap. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-sm mb-lg">
        <span style={{ fontSize: '1.5rem' }}>🤖</span>
        <h3>AI Career Mentor</h3>
      </div>
      <p className="text-muted text-sm mb-xl">
        Tell me where you are and where you want to be. I will generate a custom learning roadmap for you.
      </p>

      {!roadmap ? (
        <div className="grid" style={{ gap: '1.5rem' }}>
          <div className="input-group">
            <label>Current Skills (comma separated)</label>
            <input 
              className="input" 
              placeholder="e.g. React, JavaScript, HTML, CSS" 
              value={currentSkills}
              onChange={(e) => setCurrentSkills(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Target Role / Goal</label>
            <input 
              className="input" 
              placeholder="e.g. Full-Stack Developer, DevOps Engineer" 
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            />
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-primary" 
            disabled={isGenerating || !currentSkills || !targetRole}
            onClick={handleGenerate}
          >
            {isGenerating ? 'Mapping your future...' : 'Generate Roadmap'}
          </motion.button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="flex justify-between items-center mb-xl">
            <div>
              <h3 style={{ color: 'var(--accent-primary)' }}>{roadmap.title}</h3>
              <p className="text-muted text-sm">Estimated timeline: {roadmap.estimatedMonths} months</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setRoadmap(null)}>Reset</button>
          </div>

          <div style={{ position: 'relative', paddingLeft: '20px', borderLeft: '2px solid var(--border-primary)' }}>
            {roadmap.phases.map((phase: any, index: number) => (
              <div key={index} style={{ marginBottom: '2rem', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-27px', top: '0', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-secondary)', border: '2px solid var(--bg-primary)' }} />
                <h4 className="mb-xs">Phase {index + 1}: {phase.name}</h4>
                <p className="text-sm text-muted mb-sm">{phase.description}</p>
                <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                  {phase.topics.map((topic: string, i: number) => (
                    <span key={i} style={{ padding: '0.2rem 0.6rem', background: 'var(--bg-tertiary)', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid var(--border-primary)' }}>
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
