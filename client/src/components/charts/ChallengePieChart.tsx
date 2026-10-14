import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['var(--color-success)', 'var(--color-danger)'];

export function ChallengePieChart({ stats }: { stats?: any }) {
  const completed = stats?.challengesSolved || 0;
  const total = stats?.totalSubmissions || 0;
  const failed = Math.max(0, total - completed);

  const data = total === 0 
    ? [{ name: 'No Activity', value: 1 }] 
    : [
        { name: 'Completed', value: completed },
        { name: 'Failed / Pending', value: failed },
      ];

  const currentColors = total === 0 ? ['rgba(255,255,255,0.05)'] : COLORS;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card" 
      style={{ height: '350px', padding: '1.5rem' }}
    >
      <h3 className="mb-lg">Challenges Overview</h3>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={currentColors[index % currentColors.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', borderRadius: '8px', color: 'var(--text-primary)' }} 
            itemStyle={{ color: 'var(--text-primary)' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
