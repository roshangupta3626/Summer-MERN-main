const permissions = {
  admin: [
    'link:create',
    'link:read',
    'link:update',
    'link:delete',
    'user:create',
    'user:read',
    'user:update',
    'user:delete'
  ],
  user: [
    'link:create',
    'link:read'
  ],
  developer: [
    'link:read'
  ],
  viewer: [
    'link:read',
    'user:read'
  ]
};

module.exports = permissions;
