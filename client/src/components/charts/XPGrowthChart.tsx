import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { name: 'Mon', xp: 400 },
  { name: 'Tue', xp: 300 },
  { name: 'Wed', xp: 550 },
  { name: 'Thu', xp: 450 },
  { name: 'Fri', xp: 700 },
  { name: 'Sat', xp: 850 },
  { name: 'Sun', xp: 900 },
];

export function XPGrowthChart() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card" 
      style={{ height: '350px', padding: '1.5rem' }}
    >
      <h3 className="mb-lg">Weekly XP Growth</h3>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="var(--text-secondary)" 
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} 
            axisLine={false} 
            tickLine={false} 
          />
          <YAxis 
            stroke="var(--text-secondary)" 
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} 
            axisLine={false} 
            tickLine={false} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', borderRadius: '8px' }}
            itemStyle={{ color: 'var(--accent-primary)' }}
          />
          <Area type="monotone" dataKey="xp" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorXp)" />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
