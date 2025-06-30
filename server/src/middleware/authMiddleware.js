const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = {
    protect: async (req, res, next) => {
        try {
            const token = req.cookies?.jwtToken; // make sure login sets same key
            if (!token) {
                return res.status(401).json({ error: 'Unauthorized access' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }

            req.user = user;
            next();
        } catch (error) {
            console.log(error);
            res.status(401).json({ error: 'Invalid or expired token' });
        }
    }
};

module.exports = authMiddleware;
