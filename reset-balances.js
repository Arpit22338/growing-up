/**
 * One-time script: Reset ALL users' balances to 0 and delete all withdrawal records.
 * Run: node reset-balances.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Withdrawal = require('./models/Withdrawal');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    // Reset all users' financial fields to 0
    const userResult = await User.updateMany({}, {
      $set: {
        totalEarnings: 0,
        walletBalance: 0,
        withdrawnAmount: 0,
        dailyWithdrawCount: 0,
        lastWithdrawalDate: ''
      }
    });
    console.log(`Reset ${userResult.modifiedCount} users' balances to 0`);

    // Delete all withdrawal records
    const wResult = await Withdrawal.deleteMany({});
    console.log(`Deleted ${wResult.deletedCount} withdrawal records`);

    console.log('Done! All balances are now 0.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
