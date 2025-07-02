const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = {
  protect: async (req, res, next) => {
    try {
      const token = req.cookies?.jwtToken;

      if (!token) {
        return res.status(401).json({ error: 'Unauthorized access: Token not found' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized access: User not found' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth Middleware Error:', error.message);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  }
};

module.exports = authMiddleware;
