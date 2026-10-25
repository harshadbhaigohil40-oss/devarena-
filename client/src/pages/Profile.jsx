import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { userService, badgeService } from '../services';
import { formatNumber, progressToNextLevel, isValidHttpUrl } from '../utils/helpers';
import ChatModal from '@/features/chat/ChatModal';

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [activeChat, setActiveChat] = useState(false);

  const { data: profileData, isLoading: loading } = useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      const [pRes, sRes, bRes] = await Promise.all([
        userService.getProfile(id),
        userService.getStats(id),
        badgeService.getUserBadges(id),
      ]);
      return {
        profile: pRes.data.data.user,
        stats: sRes.data.data,
        badges: bRes.data.data.badges,
      };
    },
    enabled: !!id,
  });

  const profile = profileData?.profile;
  const stats = profileData?.stats;
  const badges = profileData?.badges || [];

  if (loading) return <div className="page-container"><div className="skeleton" style={{ height: 400 }} /></div>;
  if (!profile) return <div className="page-container"><div className="empty-state"><h3>User not found</h3></div></div>;

  const progress = progressToNextLevel(profile.xp);
  const isOtherUser = currentUser && String(currentUser._id) !== String(profile._id);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
      {/* Profile Header */}
      <div className="card mb-lg" style={{ background: 'linear-gradient(135deg, rgba(108,92,231,0.08), rgba(0,206,201,0.04))' }}>
        <div className="flex items-center gap-lg" style={{ flexWrap: 'wrap' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', background: 'var(--level-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 800, color: 'white', flexShrink: 0,
          }}>
            {profile.username?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: '1 1 200px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.75rem)', margin: 0, wordBreak: 'break-word' }}>
                {profile.username}
              </h1>
              {isOtherUser && (
                <button
                  type="button"
                  onClick={() => setActiveChat(true)}
                  className="btn btn-sm btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  💬 Message
                </button>
              )}
            </div>
            <p className="text-muted" style={{ wordBreak: 'break-word', marginTop: '0.25rem' }}>{profile.bio || 'No bio yet'}</p>
            <div className="flex items-center gap-md mt-sm" style={{ flexWrap: 'wrap' }}>
              {profile.location && <span className="text-sm text-muted">📍 {profile.location}</span>}
              {isValidHttpUrl(profile.githubUrl) && (
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm">
                  🔗 GitHub
                </a>
              )}
              {isValidHttpUrl(profile.linkedinUrl) && (
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm">
                  💼 LinkedIn
                </a>
              )}
              {isValidHttpUrl(profile.portfolioUrl) && (
                <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-sm">
                  🌐 Portfolio
                </a>
              )}
              <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{profile.role}</span>
            </div>
          </div>
          <div className="level-badge level-badge-lg">{profile.level}</div>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <div className="flex justify-between mb-sm">
            <span className="text-sm text-muted">Level {profile.level} Progress</span>
            <span className="text-sm" style={{ color: 'var(--accent-secondary)' }}>{Math.round(progress)}%</span>
          </div>
          <div className="xp-bar-container"><div className="xp-bar-fill" style={{ width: `${progress}%` }} /></div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-4 mb-lg">
        {[
          { icon: '⚡', value: formatNumber(profile.xp), label: 'Total XP' },
          { icon: '🔥', value: profile.streak || 0, label: 'Day Streak' },
          { icon: '🏆', value: stats?.challengesSolved || 0, label: 'Challenges' },
          { icon: '🏅', value: badges.length, label: 'Badges' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="card mb-lg">
        <h3 className="mb-md">Earned Badges</h3>
        {badges.length === 0 ? (
          <p className="text-muted">No badges earned yet.</p>
        ) : (
          <div className="grid grid-3">
            {badges.map((badge) => (
              <div key={badge._id} className="badge-card card" style={{ padding: '1rem' }}>
                <span className="badge-icon" style={{ fontSize: '2rem' }}>{badge.icon}</span>
                <span className="badge-name font-bold mt-xs">{badge.name}</span>
                <span className="text-xs text-muted mt-xs">{badge.description}</span>
                <span className="badge badge-warning text-xs mt-xs">+{badge.xpBonus} XP</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {activeChat && (
          <ChatModal 
            user={profile} 
            onClose={() => setActiveChat(false)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
