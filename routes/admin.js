const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Settings = require('../models/Settings');
const Withdrawal = require('../models/Withdrawal');
const courses = require('../config/courses');
const { isAdmin, isSuperAdmin, isFinancialSecretary } = require('../middleware/auth');

// Multer config — memory storage (for Vercel/serverless)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }
});

// Helper: convert multer file buffer to base64 data URI
function fileToBase64(file) {
  return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
}

// Admin login page
router.get('/admin/login', (req, res) => {
  if (req.session && (req.session.role === 'superadmin' || req.session.role === 'financial_secretary')) {
    return res.redirect('/admin');
  }
  res.render('admin/login');
});

// Admin dashboard
router.get('/admin', isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ role: 'user', isActive: true });
    const pendingPayments = await Payment.countDocuments({ status: 'pending' });
    const pendingWithdrawals = await Withdrawal.countDocuments({ status: 'pending' });
    const approvedPayments = await Payment.find({ status: 'approved' });
    const totalBalance = approvedPayments.reduce((sum, p) => sum + p.platformCommission, 0);
    const totalRevenue = approvedPayments.reduce((sum, p) => sum + p.price, 0);

    res.render('admin/dashboard', {
      role: req.session.role,
      totalUsers,
      activeUsers,
      pendingPayments,
      pendingWithdrawals,
      totalBalance,
      totalRevenue
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET - Pending payments
router.get('/admin/payments', isAdmin, async (req, res) => {
  try {
    const status = req.query.status || 'pending';
    const payments = await Payment.find({ status }).populate('user', 'firstName lastName email whatsapp').sort({ createdAt: -1 });
    res.render('admin/payments', { payments, status, role: req.session.role });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST - Approve payment
router.post('/admin/payments/:id/approve', isFinancialSecretary, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    payment.status = 'approved';
    payment.reviewedBy = req.session.userId;
    payment.reviewedAt = new Date();
    await payment.save();

    // Activate user
    const user = await User.findById(payment.user);
    if (user) {
      user.isActive = true;
      const courseIdx = user.purchasedCourses.findIndex(
        c => c.courseKey === payment.courseKey && c.status === 'pending'
      );
      if (courseIdx !== -1) {
        user.purchasedCourses[courseIdx].status = 'approved';
      }
      await user.save();
    }

    // Credit commission to referrer
    if (payment.referrer) {
      await User.findByIdAndUpdate(payment.referrer, {
        $inc: { totalEarnings: payment.referrerCommission }
      });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST - Reject payment (Super Admin only)
router.post('/admin/payments/:id/reject', isSuperAdmin, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    payment.status = 'rejected';
    payment.reviewedBy = req.session.userId;
    payment.reviewedAt = new Date();
    payment.rejectionReason = req.body.reason || '';
    await payment.save();

    // Update user's course status
    const user = await User.findById(payment.user);
    if (user) {
      const courseIdx = user.purchasedCourses.findIndex(
        c => c.courseKey === payment.courseKey && c.status === 'pending'
      );
      if (courseIdx !== -1) {
        user.purchasedCourses[courseIdx].status = 'rejected';
      }
      await user.save();
    }

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET - All users
router.get('/admin/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .populate('referredBy', 'firstName lastName referralCode')
      .sort({ createdAt: -1 });
    res.render('admin/users', { users, role: req.session.role });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET - Add user page (Super Admin only)
router.get('/admin/add-user', isSuperAdmin, (req, res) => {
  res.render('admin/addUser', { role: req.session.role });
});

// GET - User detail / referral tree
router.get('/admin/users/:id', isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('referredBy', 'firstName lastName referralCode email')
      .populate('referredUsers', 'firstName lastName email isActive whatsapp createdAt');
    if (!user) return res.status(404).send('User not found');

    const payments = await Payment.find({ user: user._id }).sort({ createdAt: -1 });
    res.render('admin/userDetail', { user, payments, role: req.session.role, baseUrl: process.env.BASE_URL || 'https://growingup.tech' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST - Delete user (Super Admin only)
router.post('/admin/users/:id/delete', isSuperAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role !== 'user') return res.status(400).json({ error: 'Cannot delete admin accounts' });

    // Remove from referrer's list
    if (user.referredBy) {
      await User.findByIdAndUpdate(user.referredBy, {
        $pull: { referredUsers: user._id }
      });
    }

    await Payment.deleteMany({ user: user._id });
    await User.findByIdAndDelete(req.params.id);

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST - Add user manually (Super Admin)
// SECURITY: Cannot create superadmin accounts through this route
router.post('/admin/users/add', isSuperAdmin, async (req, res) => {
  try {
    const { firstName, lastName, email, whatsapp, password, role, gender, referralCode } = req.body;
    
    if (!firstName || !lastName || !email || !whatsapp || !password) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    // Block creating superadmin accounts via UI
    const safeRole = (role === 'financial_secretary') ? 'financial_secretary' : 'user';
    const safeGender = (gender === 'F') ? 'F' : 'M';

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 12);
    const userData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      whatsapp: whatsapp.trim(),
      password: hashed,
      gender: safeGender,
      role: safeRole,
      isActive: true
    };

    // Link to referrer if referral code provided
    if (referralCode && referralCode.trim()) {
      const referrer = await User.findOne({ referralCode: referralCode.trim().toUpperCase() });
      if (!referrer) {
        return res.status(400).json({ error: 'Invalid referral code. No user found with that code.' });
      }
      userData.referredBy = referrer._id;
    }

    const user = new User(userData);
    await user.save();

    // Add to referrer's referredUsers list
    if (userData.referredBy) {
      await User.findByIdAndUpdate(userData.referredBy, {
        $push: { referredUsers: user._id }
      });
    }

    return res.json({ success: true, referralCode: user.referralCode, referralLink: (process.env.BASE_URL || 'https://growingup.tech') + '/register?ref=' + user.referralCode });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST - Update user role (Super Admin only)
// SECURITY: Cannot promote to superadmin — only env-defined superadmin exists
router.post('/admin/users/:id/role', isSuperAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    // Only allow promoting to 'user' or 'financial_secretary' — never 'superadmin'
    const allowedRoles = ['user', 'financial_secretary'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Cannot assign superadmin.' });
    }
    // Prevent modifying the superadmin account itself
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ error: 'User not found' });
    if (target.role === 'superadmin') {
      return res.status(403).json({ error: 'Cannot modify Super Admin role.' });
    }
    target.role = role;
    await target.save();
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET - QR settings page
router.get('/admin/settings', isSuperAdmin, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();
    res.render('admin/settings', { settings, role: req.session.role });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// POST - Upload QR codes (stored as base64 in DB)
router.post('/admin/settings/qr', isSuperAdmin, (req, res, next) => {
  upload.fields([
    { name: 'esewaQR', maxCount: 1 },
    { name: 'khaltiQR', maxCount: 1 }
  ])(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: err.code === 'LIMIT_FILE_SIZE' ? 'File too large (max 2MB)' : 'Upload error: ' + err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();

    if (req.files && req.files.esewaQR) settings.esewaQR = fileToBase64(req.files.esewaQR[0]);
    if (req.files && req.files.khaltiQR) settings.khaltiQR = fileToBase64(req.files.khaltiQR[0]);
    settings.updatedAt = new Date();
    await settings.save();

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET - Earnings overview (Super Admin only)
router.get('/admin/earnings', isSuperAdmin, async (req, res) => {
  try {
    const payments = await Payment.find({ status: 'approved' })
      .populate('user', 'firstName lastName email')
      .populate('referrer', 'firstName lastName email')
      .sort({ reviewedAt: -1 });

    const totalRevenue = payments.reduce((sum, p) => sum + p.price, 0);
    const totalPlatform = payments.reduce((sum, p) => sum + p.platformCommission, 0);
    const totalReferrer = payments.reduce((sum, p) => sum + p.referrerCommission, 0);

    res.render('admin/earnings', { payments, totalRevenue, totalPlatform, totalReferrer, role: req.session.role });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// POST - Reset everything to zero (Super Admin only)
router.post('/admin/reset-everything', isSuperAdmin, async (req, res) => {
  try {
    // Delete all payments
    await Payment.deleteMany({});

    // Reset all users: earnings to 0, deactivate, clear purchased courses & referredUsers
    await User.updateMany(
      { role: 'user' },
      {
        $set: {
          totalEarnings: 0,
          isActive: false,
          purchasedCourses: [],
          referredUsers: []
        }
      }
    );

    console.log('RESET: Everything reset to zero by superadmin', req.session.userId);
    res.json({ success: true });
  } catch (err) {
    console.error('Reset error:', err);
    res.status(500).json({ error: 'Reset failed' });
  }
});

// GET - Withdrawal requests (Super Admin only — FinSec cannot touch withdrawals)
router.get('/admin/withdrawals', isSuperAdmin, async (req, res) => {
  try {
    const status = req.query.status || 'pending';
    const withdrawals = await Withdrawal.find({ status })
      .populate('user', 'firstName lastName email whatsapp totalEarnings')
      .sort({ createdAt: -1 });
    res.render('admin/withdrawals', { withdrawals, status, role: req.session.role });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST - Approve withdrawal (Super Admin only)
router.post('/admin/withdrawals/:id/approve', isSuperAdmin, async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) return res.status(404).json({ error: 'Withdrawal not found' });
    if (withdrawal.status !== 'pending') return res.status(400).json({ error: 'Withdrawal already processed' });

    withdrawal.status = 'approved';
    withdrawal.reviewedBy = req.session.userId;
    withdrawal.reviewedAt = new Date();
    await withdrawal.save();

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST - Reject withdrawal (Super Admin only)
router.post('/admin/withdrawals/:id/reject', isSuperAdmin, async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) return res.status(404).json({ error: 'Withdrawal not found' });
    if (withdrawal.status !== 'pending') return res.status(400).json({ error: 'Withdrawal already processed' });

    withdrawal.status = 'rejected';
    withdrawal.rejectionReason = req.body.reason || '';
    withdrawal.reviewedBy = req.session.userId;
    withdrawal.reviewedAt = new Date();
    await withdrawal.save();

    // Refund the reserved amount back to user's available balance
    await User.findByIdAndUpdate(withdrawal.user, {
      $inc: { withdrawnAmount: -withdrawal.amount }
    });

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET - Recursive referral tree API (Admin)
router.get('/admin/users/:id/tree', isAdmin, async (req, res) => {
  try {
    async function buildTree(userId, depth) {
      if (depth > 10) return []; // Prevent infinite loops
      const children = await User.find({ referredBy: userId })
        .select('firstName lastName email isActive referralCode createdAt')
        .lean();
      const result = [];
      for (const child of children) {
        const grandChildren = await buildTree(child._id, depth + 1);
        result.push({
          _id: child._id,
          name: child.firstName + ' ' + child.lastName,
          email: child.email,
          isActive: child.isActive,
          referralCode: child.referralCode,
          joined: child.createdAt,
          children: grandChildren
        });
      }
      return result;
    }

    const tree = await buildTree(req.params.id, 0);
    return res.json({ tree });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET - Referral tree viewer page (Super Admin only)
router.get('/admin/referral-tree', isSuperAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('firstName lastName email referralCode isActive').sort({ firstName: 1 });
    res.render('admin/referralTree', { users, role: req.session.role });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Also add withdrawals quick action count to admin dashboard
router.get('/admin/dashboard-data', isAdmin, async (req, res) => {
  try {
    const pendingWithdrawals = await Withdrawal.countDocuments({ status: 'pending' });
    return res.json({ pendingWithdrawals });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
