const ROLES = {
  DEVELOPER: 'developer',
  RECRUITER: 'recruiter',
  ADMIN: 'admin',
};

const PERMISSIONS = {
  [ROLES.DEVELOPER]: [
    'profile:read', 'profile:write',
    'challenge:read', 'challenge:submit',
    'project:read', 'project:write', 'project:delete',
    'leaderboard:read',
    'ai:use',
    'badge:read',
    'skilltree:read', 'skilltree:unlock',
  ],
  [ROLES.RECRUITER]: [
    'profile:read',
    'talent:search', 'talent:view',
    'shortlist:manage',
    'analytics:read',
  ],
  [ROLES.ADMIN]: [
    'profile:read', 'profile:write',
    'challenge:read', 'challenge:write', 'challenge:delete',
    'project:read', 'project:write', 'project:delete',
    'leaderboard:read', 'leaderboard:manage',
    'ai:use',
    'badge:read', 'badge:write',
    'skilltree:read', 'skilltree:write',
    'user:manage',
    'talent:search', 'talent:view',
    'analytics:read',
  ],
};

const hasPermission = (role, permission) => {
  return PERMISSIONS[role]?.includes(permission) || false;
};

module.exports = { ROLES, PERMISSIONS, hasPermission };
