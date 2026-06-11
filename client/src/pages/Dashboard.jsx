import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services';
import { formatNumber, progressToNextLevel, xpForLevel } from '../utils/helpers';
import { useChatStore } from '../store/useChatStore';
import ChatModal from '@/features/chat/ChatModal';
import { XPGrowthChart } from '../components/charts/XPGrowthChart';
import { SkillRadarChart } from '../components/charts/SkillRadarChart';
import { ChallengePieChart } from '../components/charts/ChallengePieChart';
import { ActivityHeatmap } from '../components/charts/ActivityHeatmap';

export default function Dashboard() {
  const { user } = useAuth();
  const { conversations, fetchConversations } = useChatStore();
  const [activeChatUser, setActiveChatUser] = useState(null);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['userStats', user?._id],
    queryFn: async () => {
      const res = await userService.getStats(user._id);
      return res.data.data;
    },
    enabled: !!user?._id,
  });

  useEffect(() => {
    if (user?._id) {
      fetchConversations();
    }
  }, [user]);

  if (!user) return null;
  const progress = stats ? progressToNextLevel(stats.xp || user.xp) : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
      <div style={{ marginBottom: '2.5rem', position: 'relative' }}>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.5px' }}
        >
          Welcome back, <span style={{ background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 15px rgba(108,92,231,0.4))' }}>{user.username}</span> 👋
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-muted" style={{ fontSize: '1.1rem' }}>
          Here's your progress overview and daily stats
        </motion.p>
      </div>

      {/* Premium XP Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="card" 
        style={{ 
          marginBottom: '2rem', 
          background: 'linear-gradient(135deg, rgba(108,92,231,0.15) 0%, rgba(0,206,201,0.05) 100%)', 
          border: '1px solid rgba(108,92,231,0.3)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.05)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Ambient Glow */}
        <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'var(--accent-primary)', filter: 'blur(100px)', opacity: 0.2, zIndex: 0 }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
            <div className="flex items-center gap-lg">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="level-badge" 
                style={{ width: 80, height: 80, fontSize: '2.5rem', boxShadow: '0 0 30px rgba(108,92,231,0.4), inset 0 0 15px rgba(255,255,255,0.3)' }}
              >
                {user.level}
              </motion.div>
              <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Level {user.level}</h3>
                <p className="text-muted" style={{ fontSize: '1rem' }}>
                  <span style={{ color: 'var(--xp-gold)', fontWeight: 700 }}>{formatNumber(stats?.xp || user.xp)}</span> XP total
                </p>
              </div>
            </div>
            <div className="flex items-center gap-md" style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <motion.span animate={{ scale: [1, 1.2, 1], filter: ['drop-shadow(0 0 0px #ff9f43)', 'drop-shadow(0 0 15px #ff9f43)', 'drop-shadow(0 0 0px #ff9f43)'] }} transition={{ repeat: Infinity, duration: 2 }} style={{ fontSize: '2rem' }}>🔥</motion.span>
              <div>
                <p style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--color-warning)', lineHeight: 1 }}>{stats?.streak || user.streak || 0}</p>
                <p className="text-xs text-muted" style={{ textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>Day Streak</p>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            <div className="flex justify-between mb-sm">
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Progress to Level {user.level + 1}</span>
              <span className="text-sm font-bold" style={{ color: 'var(--accent-secondary)', textShadow: '0 0 10px var(--accent-secondary)' }}>{Math.round(progress)}%</span>
            </div>
            <div className="xp-bar-container" style={{ height: 16, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)' }}>
              <motion.div 
                className="xp-bar-fill" 
                initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1.5, type: "spring" }} 
                style={{ background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))', boxShadow: '0 0 15px var(--accent-primary), inset 0 0 10px rgba(255,255,255,0.5)' }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Premium Stats Grid */}
      <div className="grid grid-4" style={{ marginBottom: '2.5rem' }}>
        {[
          { icon: '⚔️', value: stats?.challengesSolved || 0, label: 'Challenges Solved', color: 'var(--color-success)' },
          { icon: '📝', value: stats?.totalSubmissions || 0, label: 'Total Submissions', color: 'var(--color-info)' },
          { icon: '🏅', value: stats?.recentBadges?.length || 0, label: 'Badges Earned', color: 'var(--xp-gold)' },
          { icon: '🚀', value: user.projectCount || 0, label: 'Projects Built', color: 'var(--accent-secondary)' },
        ].map((s, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} 
            whileHover={{ y: -5, scale: 1.02, boxShadow: `0 15px 30px rgba(0,0,0,0.3), inset 0 0 0 1px ${s.color}40` }}
            className="stat-card"
            style={{ position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', fontSize: '4rem', opacity: 0.05, filter: 'grayscale(100%)' }}>{s.icon}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '1.5rem', background: `${s.color}20`, padding: '0.5rem', borderRadius: '12px', display: 'flex' }}>{s.icon}</div>
              <div className="stat-value" style={{ fontSize: '2rem', color: 'var(--text-primary)', textShadow: `0 2px 10px ${s.color}40` }}>{s.value}</div>
            </div>
            <div className="stat-label" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Glowing Quick Actions */}
      <div className="grid grid-3 mb-xl">
        {[
          { to: '/challenges', icon: '⚔️', title: 'Solve Challenges', desc: 'Earn XP by solving coding problems', color: '#ff7675' },
          { to: '/skill-trees', icon: '🌳', title: 'Skill Trees', desc: 'Track your learning progress', color: '#55efc4' },
          { to: '/ai-advisor', icon: '🤖', title: 'AI Career Advisor', desc: 'Get personalized career guidance', color: '#74b9ff' },
        ].map((a, i) => (
          <Link key={i} to={a.to} style={{ textDecoration: 'none' }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }} 
              whileHover={{ y: -5, boxShadow: `0 10px 30px ${a.color}20`, borderColor: `${a.color}50` }}
              className="card" 
              style={{ cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s ease' }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', filter: `drop-shadow(0 0 10px ${a.color}50)` }}>{a.icon}</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{a.title}</h3>
              <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>{a.desc}</p>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Analytics Row 1 */}
      <div className="grid grid-2 mb-xl">
        <XPGrowthChart />
        <SkillRadarChart />
      </div>

      {/* Analytics Row 2 */}
      <div className="grid grid-2 mb-xl" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <ChallengePieChart />
        <ActivityHeatmap />
      </div>

      {/* Messages / Conversations */}
      {conversations?.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>💬 Recent Messages</h3>
          <div className="grid grid-3">
            {conversations.map((conv, i) => (
              <motion.div key={conv._id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{ y: -5, borderColor: 'var(--border-primary)' }}
                className="card" style={{ cursor: 'pointer', padding: '1rem', border: '1px solid rgba(255,255,255,0.05)' }} onClick={() => setActiveChatUser(conv.user)}>
                <div className="flex items-center gap-sm mb-sm">
                  <div className="level-badge" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>{conv.user.level || '?'}</div>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{conv.user.username}</span>
                </div>
                <p className="text-sm text-muted" style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {conv.lastMessage.content}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {activeChatUser && <ChatModal user={activeChatUser} onClose={() => setActiveChatUser(null)} />}
      </AnimatePresence>
    </motion.div>
  );
}
