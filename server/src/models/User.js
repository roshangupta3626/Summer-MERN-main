// src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String },
  isGoogleUser: { type: Boolean, default: false },
  googleId: { type: String, required: true },
  role: { type: String, default: 'admin'},
  adminId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true},
});

module.exports = mongoose.model('User', userSchema);
