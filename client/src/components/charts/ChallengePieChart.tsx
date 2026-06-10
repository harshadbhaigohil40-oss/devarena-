import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { name: 'Completed', value: 45 },
  { name: 'Pending', value: 12 },
  { name: 'Failed', value: 4 },
];

const COLORS = ['var(--color-success)', 'var(--color-warning)', 'var(--color-danger)'];

export function ChallengePieChart() {
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
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
