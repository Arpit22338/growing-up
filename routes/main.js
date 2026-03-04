const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Settings = require('../models/Settings');
const Withdrawal = require('../models/Withdrawal');
const courses = require('../config/courses');
const multer = require('multer');
const { isAuthenticated, isActiveUser } = require('../middleware/auth');

// Multer config — memory storage (for Vercel/serverless compatibility)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const mime = allowed.test(file.mimetype);
    if (mime) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  }
});

// Helper: convert multer file buffer to base64 data URI
function fileToBase64(file) {
  return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
}

// GET - Home page
router.get('/', async (req, res) => {
  let loggedInUser = null;
  if (req.session && req.session.userId) {
    try {
      loggedInUser = await User.findById(req.session.userId).select('purchasedCourses isActive referralCode profilePicture');
    } catch (e) {}
  }
  res.render('index', { courses, loggedInUser });
});

// GET - Sitemap.xml (PSEO)
router.get('/sitemap.xml', (req, res) => {
  const baseUrl = process.env.BASE_URL || 'https://growingup.vercel.app';
  const courseKeys = Object.keys(courses);
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  xml += `  <url><loc>${baseUrl}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>\n`;
  xml += `  <url><loc>${baseUrl}/register</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>\n`;
  xml += `  <url><loc>${baseUrl}/login</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>\n`;
  courseKeys.forEach(key => {
    xml += `  <url><loc>${baseUrl}/course/${key}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>\n`;
  });
  xml += `</urlset>`;
  res.set('Content-Type', 'application/xml');
  res.send(xml);
});

// GET - Course page with optional referral
router.get('/course/:key', async (req, res) => {
  const course = courses[req.params.key];
  if (!course) return res.redirect('/');
  const ref = req.query.ref || '';
  
  // Check if user is logged in — pass user data for refer button
  let loggedInUser = null;
  if (req.session && req.session.userId) {
    try {
      loggedInUser = await User.findById(req.session.userId).select('referralCode isActive firstName');
    } catch (e) {}
  }
  
  const baseUrl = process.env.BASE_URL || '';
  res.render('course', { course, ref, loggedInUser, baseUrl });
});

// GET - Register page
router.get('/register', (req, res) => {
  const ref = req.query.ref || '';
  const course = req.query.course || '';
  res.render('register', { courses, ref, selectedCourse: course });
});

// POST - Validate referral code (AJAX)
router.post('/api/validate-referral', async (req, res) => {
  try {
    const { code } = req.body;
    const referrer = await User.findOne({ referralCode: code.toUpperCase(), isActive: true });
    if (!referrer) {
      return res.json({ valid: false });
    }
    return res.json({
      valid: true,
      name: referrer.fullName,
      whatsapp: referrer.whatsapp
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST - Step 1: Register account info
router.post('/api/register/step1', async (req, res) => {
  try {
    const { firstName, middleName, lastName, whatsapp, email, gender, referralCode } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Validate referral code
    const referrer = await User.findOne({ referralCode: referralCode.toUpperCase(), isActive: true });
    if (!referrer) {
      return res.status(400).json({ error: 'Invalid referral code' });
    }

    // Store step 1 data in session
    req.session.registration = {
      firstName: firstName.trim(),
      middleName: (middleName || '').trim(),
      lastName: lastName.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim().toLowerCase(),
      gender,
      referrerId: referrer._id,
      referralCode: referralCode.toUpperCase()
    };

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST - Step 2: Payment screenshot upload (stored as base64 in DB)
router.post('/api/register/step2', upload.single('screenshot'), async (req, res) => {
  try {
    if (!req.session.registration) {
      return res.status(400).json({ error: 'Please complete step 1 first' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Payment screenshot is required' });
    }

    const { courseKey, transactionId } = req.body;
    const course = courses[courseKey];
    if (!course) {
      return res.status(400).json({ error: 'Invalid course selected' });
    }

    // One-course-per-user: check if this email already has an approved course
    const existingUser = await User.findOne({ email: req.session.registration.email });
    if (existingUser) {
      const hasApproved = existingUser.purchasedCourses.some(c => c.status === 'approved');
      if (hasApproved) {
        return res.status(400).json({ error: 'You already own a course. One course per account only.' });
      }
    }

    req.session.registration.courseKey = courseKey;
    req.session.registration.courseName = course.name;
    req.session.registration.price = course.price;
    req.session.registration.screenshot = fileToBase64(req.file);
    req.session.registration.transactionId = transactionId || '';

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST - Step 3: Set password & create account
router.post('/api/register/step3', async (req, res) => {
  try {
    if (!req.session.registration || !req.session.registration.screenshot) {
      return res.status(400).json({ error: 'Please complete previous steps first' });
    }

    const { password, profilePicture } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Validate profile picture size (max ~500KB base64)
    let validProfilePic = '';
    if (profilePicture && typeof profilePicture === 'string' && profilePicture.startsWith('data:image/')) {
      if (profilePicture.length <= 700000) {
        validProfilePic = profilePicture;
      }
    }

    const reg = req.session.registration;
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      firstName: reg.firstName,
      middleName: reg.middleName,
      lastName: reg.lastName,
      email: reg.email,
      whatsapp: reg.whatsapp,
      gender: reg.gender,
      password: hashedPassword,
      profilePicture: validProfilePic,
      referredBy: reg.referrerId,
      isActive: false,
      purchasedCourses: [{
        courseKey: reg.courseKey,
        courseName: reg.courseName,
        price: reg.price,
        paymentScreenshot: reg.screenshot,
        transactionId: reg.transactionId,
        status: 'pending'
      }]
    });

    await user.save();

    // Add to referrer's referredUsers
    await User.findByIdAndUpdate(reg.referrerId, {
      $addToSet: { referredUsers: user._id }
    });

    // Create payment record
    const payment = new Payment({
      user: user._id,
      courseKey: reg.courseKey,
      courseName: reg.courseName,
      price: reg.price,
      screenshot: reg.screenshot,
      transactionId: reg.transactionId,
      referrer: reg.referrerId,
      referrerCommission: Math.round(reg.price * 0.65),
      platformCommission: Math.round(reg.price * 0.35)
    });
    await payment.save();

    // Clear registration session
    delete req.session.registration;

    return res.json({ success: true, message: 'Account created! Awaiting payment verification.' });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET - Payment QR codes (base64 from DB)
router.get('/api/qr-codes', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = { esewaQR: '', khaltiQR: '' };
    }
    return res.json({
      esewa: settings.esewaQR || '',
      khalti: settings.khaltiQR || ''
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET - Login page
router.get('/login', (req, res) => {
  if (req.session && req.session.userId) {
    if (req.session.role === 'superadmin' || req.session.role === 'financial_secretary') {
      return res.redirect('/admin');
    }
    return res.redirect('/dashboard');
  }
  res.render('login');
});

// POST - Login
router.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check hardcoded admin credentials first
    if (email === process.env.SUPER_ADMIN_EMAIL && password === process.env.SUPER_ADMIN_PASSWORD) {
      let admin = await User.findOne({ email: process.env.SUPER_ADMIN_EMAIL });
      if (!admin) {
        const hashed = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 12);
        admin = new User({
          firstName: 'Super',
          lastName: 'Admin',
          email: process.env.SUPER_ADMIN_EMAIL,
          whatsapp: '0000000000',
          gender: 'M',
          password: hashed,
          role: 'superadmin',
          isActive: true
        });
        await admin.save();
      }
      // Set session (safe for serverless — avoids regenerate issues)
      req.session.userId = admin._id;
      req.session.role = 'superadmin';
      req.session.userName = admin.firstName || 'Admin';
      req.session.profilePicture = admin.profilePicture || '';
      req.session.isActive = true;
      req.session.csrfToken = require('crypto').randomBytes(32).toString('hex');
      req.session.loginAt = Date.now();
      return req.session.save((err) => {
        if (err) console.error('Session save error:', err);
        return res.json({ success: true, redirect: '/admin' });
      });
    }

    if (email === process.env.FIN_SEC_EMAIL && password === process.env.FIN_SEC_PASSWORD) {
      let finSec = await User.findOne({ email: process.env.FIN_SEC_EMAIL });
      if (!finSec) {
        const hashed = await bcrypt.hash(process.env.FIN_SEC_PASSWORD, 12);
        finSec = new User({
          firstName: 'Financial',
          lastName: 'Secretary',
          email: process.env.FIN_SEC_EMAIL,
          whatsapp: '0000000000',
          gender: 'M',
          password: hashed,
          role: 'financial_secretary',
          isActive: true
        });
        await finSec.save();
      }
      // Set session (safe for serverless)
      req.session.userId = finSec._id;
      req.session.role = 'financial_secretary';
      req.session.userName = finSec.firstName || 'Finance';
      req.session.profilePicture = finSec.profilePicture || '';
      req.session.isActive = true;
      req.session.csrfToken = require('crypto').randomBytes(32).toString('hex');
      req.session.loginAt = Date.now();
      return req.session.save((err) => {
        if (err) console.error('Session save error:', err);
        return res.json({ success: true, redirect: '/admin' });
      });
    }

    // Regular user login
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isActive) {
      // Check if account was rejected
      const pendingPayment = await Payment.findOne({ user: user._id }).sort({ createdAt: -1 });
      if (pendingPayment && pendingPayment.status === 'rejected') {
        return res.status(403).json({
          error: 'Your account was rejected.',
          reason: pendingPayment.rejectionReason || 'Payment could not be verified. Please contact support on WhatsApp.',
          rejected: true
        });
      }
      return res.json({ success: true, redirect: '/pending' });
    }

    // Set session (safe for serverless — avoids regenerate issues)
    req.session.userId = user._id;
    req.session.role = user.role;
    req.session.userName = user.firstName || 'User';
    req.session.profilePicture = user.profilePicture || '';
    req.session.isActive = user.isActive;
    req.session.csrfToken = require('crypto').randomBytes(32).toString('hex');
    req.session.loginAt = Date.now();

    const redirect = (user.role === 'superadmin' || user.role === 'financial_secretary') ? '/admin' : '/dashboard';
    return req.session.save((err) => {
      if (err) console.error('Session save error:', err);
      return res.json({ success: true, redirect });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET - Pending page
router.get('/pending', (req, res) => {
  res.render('pending');
});

// GET - User Dashboard
router.get('/dashboard', async (req, res) => {
  if (!req.session || !req.session.userId) return res.redirect('/login');
  try {
    const user = await User.findById(req.session.userId).populate('referredUsers', 'firstName lastName email isActive');
    if (!user || !user.isActive) return res.redirect('/pending');
    
    const withdrawals = await Withdrawal.find({ user: user._id }).sort({ createdAt: -1 });
    const approvedTotal = withdrawals.filter(w => w.status === 'approved').reduce((s, w) => s + w.amount, 0);
    const pendingTotal = withdrawals.filter(w => w.status === 'pending').reduce((s, w) => s + w.amount, 0);
    const availableBalance = user.totalEarnings - approvedTotal - pendingTotal;
    
    res.render('dashboard', { user, courses, baseUrl: process.env.BASE_URL, withdrawals, availableBalance });
  } catch (err) {
    res.redirect('/login');
  }
});

// GET - My Wallet page
router.get('/dashboard/wallet', async (req, res) => {
  if (!req.session || !req.session.userId) return res.redirect('/login');
  try {
    const user = await User.findById(req.session.userId);
    if (!user || !user.isActive) return res.redirect('/pending');

    const withdrawals = await Withdrawal.find({ user: user._id }).sort({ createdAt: -1 });
    const approvedTotal = withdrawals.filter(w => w.status === 'approved').reduce((s, w) => s + w.amount, 0);
    const pendingTotal = withdrawals.filter(w => w.status === 'pending').reduce((s, w) => s + w.amount, 0);
    const availableBalance = user.totalEarnings - approvedTotal - pendingTotal;

    const baseUrl = 'https://growingup.tech';
    const code = user.referralCode;

    res.render('wallet', {
      user,
      withdrawals,
      availableBalance,
      referralLink: baseUrl + '/register?ref=' + code,
      starterLink: baseUrl + '/course/starter?ref=' + code,
      primeLink: baseUrl + '/course/prime?ref=' + code,
      masterLink: baseUrl + '/course/master?ref=' + code,
      bundleLink: baseUrl + '/course/bundle?ref=' + code
    });
  } catch (err) {
    res.redirect('/dashboard');
  }
});

// GET - Withdraw page
router.get('/dashboard/withdraw', async (req, res) => {
  if (!req.session || !req.session.userId) return res.redirect('/login');
  try {
    const user = await User.findById(req.session.userId);
    if (!user || !user.isActive) return res.redirect('/pending');

    const withdrawals = await Withdrawal.find({ user: user._id }).sort({ createdAt: -1 });
    const approvedTotal = withdrawals.filter(w => w.status === 'approved').reduce((s, w) => s + w.amount, 0);
    const pendingTotal = withdrawals.filter(w => w.status === 'pending').reduce((s, w) => s + w.amount, 0);
    const availableBalance = user.totalEarnings - approvedTotal - pendingTotal;

    res.render('withdraw', { user, withdrawals, availableBalance });
  } catch (err) {
    res.redirect('/dashboard');
  }
});

// POST - Request withdrawal (HARDENED)
router.post('/api/withdraw', async (req, res) => {
  // 1. Auth check
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ success: false, message: 'Please login first' });
  }

  try {
    // 2. Fetch user fresh from DB (never trust session/frontend)
    const user = await User.findById(req.session.userId).select('+totalEarnings +lastWithdrawalDate +dailyWithdrawCount +isActive');
    if (!user || !user.isActive) {
      return res.status(403).json({ success: false, message: 'Account not active' });
    }

    // 3. Rate limiting: max 3 withdrawal requests per user per day
    const today = new Date().toDateString();
    if (user.lastWithdrawalDate === today && user.dailyWithdrawCount >= 3) {
      return res.status(429).json({ success: false, message: 'Max 3 withdrawal requests per day.' });
    }

    // 4. Block if user already has a PENDING withdrawal
    const existingPending = await Withdrawal.findOne({ user: user._id, status: 'pending' });
    if (existingPending) {
      return res.status(400).json({ success: false, message: 'You already have a pending withdrawal request. Wait for it to be processed first.' });
    }

    // 5. Validate and sanitize all inputs
    const { amount, method, walletId, accountName } = req.body;

    // Platform must be exactly 'esewa' or 'khalti' (no bank for now based on withdraw.ejs)
    if (!['esewa', 'khalti'].includes(method)) {
      return res.status(400).json({ success: false, message: 'Invalid platform. Must be esewa or khalti.' });
    }

    // Amount must be valid positive integer >= 400
    const requestedAmount = parseInt(amount, 10);
    if (!requestedAmount || isNaN(requestedAmount) || requestedAmount < 400) {
      return res.status(400).json({ success: false, message: 'Minimum withdrawal is ₹400.' });
    }
    if (requestedAmount > 100000) {
      return res.status(400).json({ success: false, message: 'Maximum withdrawal is ₹1,00,000 per request.' });
    }

    // Account name: string, max 100 chars
    if (!accountName || typeof accountName !== 'string') {
      return res.status(400).json({ success: false, message: 'Account name is required.' });
    }
    const sanitizedAccountName = accountName.toString().trim().substring(0, 100);
    if (!sanitizedAccountName) {
      return res.status(400).json({ success: false, message: 'Account name is required.' });
    }

    // Phone number: must be 10 digits only
    if (!walletId || typeof walletId !== 'string') {
      return res.status(400).json({ success: false, message: 'Phone number is required.' });
    }
    const sanitizedPhone = walletId.toString().trim();
    if (!/^\d{10}$/.test(sanitizedPhone)) {
      return res.status(400).json({ success: false, message: 'Phone number must be exactly 10 digits.' });
    }

    // 6. Compute available balance from totalEarnings minus all approved+pending withdrawals
    const allWithdrawals = await Withdrawal.find({ user: user._id });
    const approvedTotal = allWithdrawals.filter(w => w.status === 'approved').reduce((s, w) => s + w.amount, 0);
    const pendingTotal = allWithdrawals.filter(w => w.status === 'pending').reduce((s, w) => s + w.amount, 0);
    const availableBalance = user.totalEarnings - approvedTotal - pendingTotal;

    if (requestedAmount > availableBalance) {
      return res.status(400).json({ success: false, message: 'Insufficient balance. Available: ₹' + availableBalance });
    }

    // 7. Update daily withdrawal tracking
    const updateQuery = user.lastWithdrawalDate === today
      ? { $inc: { dailyWithdrawCount: 1 } }
      : { $set: { lastWithdrawalDate: today, dailyWithdrawCount: 1 } };

    await User.findByIdAndUpdate(user._id, updateQuery);

    // 8. Create withdrawal record (no fee for eSewa/Khalti)
    const withdrawal = new Withdrawal({
      user: user._id,
      amount: requestedAmount,
      method,
      fee: 0,
      netAmount: requestedAmount,
      walletId: sanitizedPhone,
      accountName: sanitizedAccountName
    });

    await withdrawal.save();

    return res.json({ success: true, message: 'Withdrawal request submitted!' });
  } catch (err) {
    console.error('Withdrawal error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST - Withdrawal alias route (maps /api/withdrawals → same logic as /api/withdraw)
router.post('/api/withdrawals', async (req, res) => {
  // Map alternate field names to canonical ones
  if (req.body.platform && !req.body.method) req.body.method = req.body.platform;
  if (req.body.phoneNumber && !req.body.walletId) req.body.walletId = req.body.phoneNumber;
  // Forward to same handler logic
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ success: false, message: 'Please login first' });
  }
  try {
    const user = await User.findById(req.session.userId).select('+totalEarnings +lastWithdrawalDate +dailyWithdrawCount +isActive');
    if (!user || !user.isActive) return res.status(403).json({ success: false, message: 'Account not active' });

    const today = new Date().toDateString();
    if (user.lastWithdrawalDate === today && user.dailyWithdrawCount >= 3) {
      return res.status(429).json({ success: false, message: 'Max 3 withdrawal requests per day.' });
    }
    const existingPending = await Withdrawal.findOne({ user: user._id, status: 'pending' });
    if (existingPending) return res.status(400).json({ success: false, message: 'You already have a pending withdrawal request.' });

    const { method, accountName, walletId } = req.body;
    if (!['esewa', 'khalti'].includes(method)) return res.status(400).json({ success: false, message: 'Select eSewa or Khalti' });

    const amt = parseInt(req.body.amount, 10);
    if (!amt || amt < 400) return res.status(400).json({ success: false, message: 'Minimum ₹400' });

    // Compute available balance the same way the frontend does
    const allWithdrawals = await Withdrawal.find({ user: user._id });
    const approvedTotal = allWithdrawals.filter(w => w.status === 'approved').reduce((s, w) => s + w.amount, 0);
    const pendingTotal = allWithdrawals.filter(w => w.status === 'pending').reduce((s, w) => s + w.amount, 0);
    const availableBalance = user.totalEarnings - approvedTotal - pendingTotal;

    if (amt > availableBalance) return res.status(400).json({ success: false, message: 'Insufficient balance. Available: ₹' + availableBalance });
    if (!accountName) return res.status(400).json({ success: false, message: 'Fill all fields' });
    if (!walletId || !/^\d{10}$/.test(walletId.trim())) return res.status(400).json({ success: false, message: 'Enter valid phone number' });

    const updateQuery = user.lastWithdrawalDate === today
      ? { $inc: { dailyWithdrawCount: 1 } }
      : { $set: { lastWithdrawalDate: today, dailyWithdrawCount: 1 } };

    await User.findByIdAndUpdate(user._id, updateQuery);

    await Withdrawal.create({
      user: user._id,
      amount: amt,
      method,
      fee: 0,
      netAmount: amt,
      walletId: walletId.trim(),
      accountName: accountName.trim().substring(0, 100)
    });

    return res.json({ success: true, message: 'Withdrawal request submitted!' });
  } catch (err) {
    console.error('Withdrawal error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET - User profile (redirects to dashboard for now)
router.get('/dashboard/profile', (req, res) => {
  if (!req.session || !req.session.userId) return res.redirect('/login');
  res.redirect('/dashboard');
});

// GET - User withdrawals history (JSON)
router.get('/api/my-withdrawals', async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Please login first' });
  }
  try {
    const withdrawals = await Withdrawal.find({ user: req.session.userId }).sort({ createdAt: -1 });
    return res.json({ withdrawals });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET - Logout — destroy session fully and clear cookie
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.clearCookie('gu_sid', { path: '/' });
    res.redirect('/');
  });
});


// GET - Read Course (only for owned courses)
router.get('/course/:key/read', async (req, res) => {
  if (!req.session || !req.session.userId) return res.redirect('/login');
  const courseKey = req.params.key;
  const course = courses[courseKey];
  if (!course) return res.redirect('/');

  try {
    const user = await User.findById(req.session.userId);
    if (!user || !user.isActive) return res.redirect('/pending');
    // Check if user owns this course (approved only)
    const owned = user.purchasedCourses.some(c => c.courseKey === courseKey && c.status === 'approved');
    if (!owned) return res.status(403).render('404', { message: 'You do not have access to this course.' });

    // Map courseKey to partial path
    const contentPartial = `partials/course-contents/${courseKey}`;
    res.render('course-read', { course, contentPartial, loggedInUser: user });
  } catch (err) {
    return res.status(500).render('404', { message: 'Server error.' });
  }
});

module.exports = router;
