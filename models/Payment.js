const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseKey: { type: String, required: true },
  courseName: { type: String, required: true },
  price: { type: Number, required: true },
  screenshot: { type: String, required: true },
  transactionId: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  reviewedAt: { type: Date, default: null },
  rejectionReason: { type: String, default: '' },
  referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  referrerCommission: { type: Number, default: 0 },
  platformCommission: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
