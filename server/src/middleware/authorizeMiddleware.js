const permissions = require('../constants/permissions');

module.exports = (requiredPermission) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log('User :', user);

    const userPermissions = permissions[user.role] || [];
    if (!userPermissions.includes(requiredPermission)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient Permissions' });
    }

    next();
  };
};
