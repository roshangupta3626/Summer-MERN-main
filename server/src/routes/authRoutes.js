// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');

const loginValidator = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isEmail().withMessage('Username must be a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 4 }).withMessage('Password must be at least 4 characters')
];

router.post('/register', authController.register);
router.post('/login', loginValidator, authController.login);
router.post('/google-login', authController.googleAuth);
router.post('/logout', authController.logout);
router.get('/isUserLoggedIn', authController.isUserLoggedIn);

module.exports = router;
