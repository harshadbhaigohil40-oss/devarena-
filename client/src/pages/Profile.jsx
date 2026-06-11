import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { userService, badgeService } from '../services';
import { formatNumber, progressToNextLevel } from '../utils/helpers';

export default function Profile() {
  const { id } = useParams();

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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
      {/* Profile Header */}
      <div className="card mb-lg" style={{ background: 'linear-gradient(135deg, rgba(108,92,231,0.08), rgba(0,206,201,0.04))' }}>
        <div className="flex items-center gap-lg" style={{ flexWrap: 'wrap' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', background: 'var(--level-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 800, color: 'white',
          }}>
            {profile.username?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{profile.username}</h1>
            <p className="text-muted">{profile.bio || 'No bio yet'}</p>
            <div className="flex items-center gap-md mt-sm" style={{ flexWrap: 'wrap' }}>
              {profile.location && <span className="text-sm text-muted">📍 {profile.location}</span>}
              {profile.githubUrl && <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="text-sm">🔗 GitHub</a>}
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
          { icon: '⚔️', value: stats?.challengesSolved || 0, label: 'Challenges' },
          { icon: '🔥', value: profile.streak || 0, label: 'Day Streak' },
          { icon: '🚀', value: profile.projectCount || 0, label: 'Projects' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="mb-lg">
          <h3 style={{ marginBottom: '1rem' }}>🏅 Badges ({badges.length})</h3>
          <div className="flex flex-wrap gap-md">
            {badges.map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem' }}>
                <span style={{ fontSize: '1.75rem' }}>{b.icon}</span>
                <div>
                  <p className="font-semibold text-sm">{b.name}</p>
                  <span className={`badge badge-rarity-${b.rarity}`} style={{ textTransform: 'capitalize' }}>{b.rarity}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {profile.topSkills?.length > 0 && (
        <div>
          <h3 style={{ marginBottom: '1rem' }}>🎯 Top Skills</h3>
          <div className="grid grid-3">
            {profile.topSkills.map((s, i) => (
              <div key={i} className="card">
                <p className="font-semibold">{s.name}</p>
                <p className="text-sm text-muted">Level {s.level}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
