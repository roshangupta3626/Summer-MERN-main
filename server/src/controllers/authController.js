const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const { validationResult } = require('express-validator');

const secret = process.env.JWT_SECRET;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authController = {
  register: async (req, res) => {
    try {
      const { username, password, name, role } = req.body;

      if (!username || !password || !name) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const existingUser = await User.findOne({ email: username });
      if (existingUser) {
        return res.status(401).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email: username,
        password: hashedPassword,
        name,
        role: role || 'admin'
      });
      await user.save();

      const userDetails = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      };

      const token = jwt.sign(userDetails, secret, { expiresIn: '1h' });
      res.cookie('jwtToken', token, { httpOnly: true, secure: false, sameSite: 'Lax' });

      res.json({ message: 'User registered', user: userDetails });
    } catch (err) {
      console.error("Register error:", err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  login: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    try {
      const { username, password } = req.body;
      const user = await User.findOne({ email: username });
      if (!user || user.isGoogleUser) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const userDetails = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'admin'
      };

      const token = jwt.sign(userDetails, secret, { expiresIn: '1h' });
      res.cookie('jwtToken', token, { httpOnly: true, secure: false, sameSite: 'Lax' });

      res.json({ message: 'Login successful', user: userDetails });
    } catch (err) {
      console.error("Login error:", err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  googleAuth: async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: 'Missing ID token' });
    }

    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      const { email, name } = payload;

      let user = await User.findOne({ email });

      if (!user) {
        user = new User({
          email,
          name,
          isGoogleUser: true,
          role: 'admin' // default role for new Google users
        });
        await user.save();
      }

      const userDetails = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'admin'
      };

      const token = jwt.sign(userDetails, secret, { expiresIn: '1h' });
      res.cookie('jwtToken', token, { httpOnly: true, secure: false, sameSite: 'Lax' });

      res.json({ message: 'Google login successful', user: userDetails });
    } catch (error) {
      console.error('Google Auth Error:', error.message);
      res.status(401).json({ message: 'Error in Google authorization flow' });
    }
  },

  logout: (req, res) => {
    res.clearCookie('jwtToken');
    res.json({ message: 'Logged out successfully' });
  },

  isUserLoggedIn: (req, res) => {
    const token = req.cookies.jwtToken;
    if (!token) return res.status(401).json({ message: 'User not logged in' });

    jwt.verify(token, secret, (err, user) => {
      if (err) return res.status(401).json({ message: 'Invalid token' });
      res.json({ message: 'User is logged in', user });
    });
  }
};

module.exports = authController;
