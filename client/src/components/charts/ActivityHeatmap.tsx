import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { motion } from 'framer-motion';
import { subDays } from 'date-fns';

import { isSameDay } from 'date-fns';

export function ActivityHeatmap({ stats }: { stats?: any }) {
  const today = new Date();
  const data = Array.from({ length: 150 }).map((_, i) => {
    const d = subDays(today, i);
    return { date: d, count: 0 };
  });

  if (stats?.recentXP) {
    stats.recentXP.forEach((event: any) => {
      const eventDate = new Date(event.createdAt);
      const dayData = data.find(d => isSameDay(d.date, eventDate));
      if (dayData) {
        dayData.count = Math.min(dayData.count + 1, 4); // Max color scale is 4
      }
    });
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card" 
      style={{ padding: '1.5rem', overflow: 'hidden' }}
    >
      <h3 className="mb-md">Contribution Activity</h3>
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <div style={{ minWidth: '600px' }}>
          <CalendarHeatmap
            startDate={subDays(today, 150)}
            endDate={today}
            values={data}
            classForValue={(value) => {
              if (!value || value.count === 0) return 'color-empty';
              return `color-scale-${value.count}`;
            }}
            tooltipDataAttrs={(value) => {
              if (!value || !value.date) return null;
              return { 'data-tooltip': `${value.date.toISOString().slice(0, 10)}: ${value.count} contributions` };
            }}
          />
        </div>
      </div>
      
      {/* Global CSS for Heatmap colors mapped to Theme Variables */}
      <style>{`
        .react-calendar-heatmap .color-empty { fill: var(--bg-tertiary); }
        .react-calendar-heatmap .color-scale-1 { fill: rgba(108, 92, 231, 0.4); }
        .react-calendar-heatmap .color-scale-2 { fill: rgba(108, 92, 231, 0.7); }
        .react-calendar-heatmap .color-scale-3 { fill: rgba(108, 92, 231, 1); }
        .react-calendar-heatmap text { fill: var(--text-secondary); font-size: 8px; font-family: var(--font-sans); }
        .react-calendar-heatmap rect { rx: 2; ry: 2; }
      `}</style>
    </motion.div>
  );
}
