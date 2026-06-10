const { hasPermission } = require('../../shared/roles');

const rbac = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const userRole = req.user.role;

    const hasAll = requiredPermissions.every(perm => hasPermission(userRole, perm));
    if (!hasAll) {
      return res.status(403).json({ error: 'Insufficient permissions.' });
    }

    next();
  };
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied for this role.' });
    }
    next();
  };
};

module.exports = { rbac, requireRole };
