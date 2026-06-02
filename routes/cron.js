const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const User = require('../models/User');

// All cron endpoints are mounted at /api/cron/*
// Vercel Cron sends: Authorization: Bearer <CRON_SECRET>
// We accept either Authorization header or ?secret=... (for manual local testing)
function checkCronAuth(req, res, next) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return res.status(500).json({ error: 'CRON_SECRET env var not set on server.' });
  }
  const auth = req.headers['authorization'] || '';
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const querySecret = (req.query && req.query.secret) ? String(req.query.secret) : '';
  if (bearer === expected || querySecret === expected) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

// Shared job: deletes approved/rejected payments older than 3 days
// and resets the daily withdrawal count for users whose last withdrawal was on a different day.
async function runCleanup() {
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  const paymentRes = await Payment.deleteMany({
    status: { $in: ['approved', 'rejected'] },
    updatedAt: { $lt: threeDaysAgo }
  });

  const today = new Date().toDateString();
  const userRes = await User.updateMany(
    { lastWithdrawalDate: { $ne: today }, dailyWithdrawCount: { $gt: 0 } },
    { $set: { dailyWithdrawCount: 0 } }
  );

  return {
    paymentsDeleted: paymentRes.deletedCount || 0,
    usersReset: userRes.modifiedCount || 0
  };
}

// GET /api/cron/cleanup
// Scheduled hourly on Vercel (see vercel.json).
// For local testing: curl "http://localhost:3000/api/cron/cleanup?secret=$CRON_SECRET"
async function cleanupHandler(req, res) {
  try {
    const counts = await runCleanup();
    const payload = { success: true, ranAt: new Date().toISOString(), ...counts };
    console.log('[cron/cleanup]', JSON.stringify(payload));
    return res.json(payload);
  } catch (err) {
    console.error('[cron/cleanup] error:', err.message);
    return res.status(500).json({ error: 'Cleanup failed', detail: err.message });
  }
}

router.get('/cleanup', checkCronAuth, cleanupHandler);
router.post('/cleanup', checkCronAuth, cleanupHandler);

module.exports = router;
