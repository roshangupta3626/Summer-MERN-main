const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String },
  name: { type: String, required: true },
  isGoogleUser: { type: Boolean, default: false },
  googleId: { type: String },
  role: { type: String, default: 'viewer' },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', index: true }
});

module.exports = mongoose.model('users', UserSchema);
