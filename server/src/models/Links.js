const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
  campaignTitle: { type: String, required: true },
  originalUrl: { type: String, required: true },
  category: { type: String, required: true },
  views: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }
}, { timestamps: true });

module.exports = mongoose.model('links', LinkSchema);
