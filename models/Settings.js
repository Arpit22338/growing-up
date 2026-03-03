const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  esewaQR: { type: String, default: '' },
  khaltiQR: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Settings', settingsSchema);
