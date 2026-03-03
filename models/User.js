const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  middleName: { type: String, trim: true, default: '' },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  whatsapp: { type: String, required: true, trim: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  password: { type: String, required: true },
  referralCode: { type: String, unique: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  referredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  purchasedCourses: [{
    courseKey: String,
    courseName: String,
    price: Number,
    purchasedAt: { type: Date, default: Date.now },
    paymentScreenshot: String,
    transactionId: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
  }],
  totalEarnings: { type: Number, default: 0 },
  isActive: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'superadmin', 'financial_secretary'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

// Generate referral code before saving
userSchema.pre('save', function(next) {
  if (!this.referralCode) {
    const namePart = (this.firstName.substring(0, 3) + this.lastName.substring(0, 2)).toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.referralCode = `GU${namePart}${randomPart}`;
  }
  next();
});

userSchema.virtual('fullName').get(function() {
  return this.middleName 
    ? `${this.firstName} ${this.middleName} ${this.lastName}`
    : `${this.firstName} ${this.lastName}`;
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
