import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { subject: 'Algorithms', A: 120, fullMark: 150 },
  { subject: 'React', A: 98, fullMark: 150 },
  { subject: 'Node.js', A: 86, fullMark: 150 },
  { subject: 'System Design', A: 99, fullMark: 150 },
  { subject: 'TypeScript', A: 85, fullMark: 150 },
  { subject: 'Databases', A: 65, fullMark: 150 },
];

export function SkillRadarChart() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="card" 
      style={{ height: '350px', padding: '1.5rem' }}
    >
      <h3 className="mb-lg">Skill Analysis</h3>
      <ResponsiveContainer width="100%" height="85%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="var(--border-primary)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
          <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', borderRadius: '8px' }} />
          <Radar name="Developer" dataKey="A" stroke="var(--accent-secondary)" fill="var(--accent-secondary)" fillOpacity={0.5} />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
