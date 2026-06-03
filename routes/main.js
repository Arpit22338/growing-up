const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Settings = require('../models/Settings');
const Withdrawal = require('../models/Withdrawal');
const courses = require('../config/courses');
const { getModules, getModuleCount } = require('../config/course-content');
const multer = require('multer');
const { uploadPfp, uploadPaymentProof, tempId } = require('../config/cloudinary');
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

// GET - Home page
router.get('/', async (req, res) => {
  let loggedInUser = null;
  if (req.session && req.session.userId) {
    try {
      loggedInUser = await User.findById(req.session.userId).select('purchasedCourses isActive referralCode profilePicture');
    } catch (e) {}
  }
  res.render('index', {
    courses, loggedInUser,
    currentPath: '/',
    title: 'Best Affiliate Marketing Platform in Nepal — Growing Up',
    metaDesc: 'Growing Up is Nepal\'s best affiliate marketing platform. Learn digital marketing, earn 65% referral commission. Starter ₹499, Prime ₹699, Master ₹1599, Everything Bundle ₹1999.',
    ogTitle: 'Best Affiliate Marketing Platform in Nepal — Growing Up',
    ogDesc: 'Join Nepal\'s best affiliate marketing platform. Learn skills, earn 65% referral commission. Courses from ₹499.',
  });
});

// GET - How It Works (public explainer page)
router.get('/how-it-works', (req, res) => {
  res.render('how-it-works', {
    currentPath: '/how-it-works',
    title: 'How It Works',
    metaDesc: 'Learn how Growing Up works: register, buy a course, share your referral link, and earn 65% commission on every sale. Step-by-step guide with FAQ.',
    ogTitle: 'How It Works — Growing Up',
    ogDesc: 'Step-by-step guide to learning digital skills and earning 65% referral commission on Growing Up.'
  });
});

// GET - Sitemap.xml (PSEO)
router.get('/sitemap.xml', (req, res) => {
  const baseUrl = 'https://www.growingup.tech';
  const courseKeys = Object.keys(courses);
  const now = new Date().toISOString().split('T')[0];
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  xml += `  <url><loc>${baseUrl}/</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>\n`;
  xml += `  <url><loc>${baseUrl}/how-it-works</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n`;
  courseKeys.forEach(key => {
    xml += `  <url><loc>${baseUrl}/course/${key}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n`;
  });
  xml += `</urlset>`;
  res.set('Content-Type', 'application/xml; charset=utf-8');
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('X-Robots-Tag', 'index, follow');
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
      loggedInUser = await User.findById(req.session.userId)
        .select('referralCode isActive firstName role purchasedCourses');
    } catch (e) {}
  }

  const baseUrl = process.env.BASE_URL || '';
  const courseKey = req.params.key;
  const courseName = course.name || '';
  const courseTitle = course.title || '';
  res.render('course', {
    course, ref, loggedInUser, baseUrl,
    currentPath: '/course/' + courseKey,
    title: courseTitle + ' (' + courseName + ' ₹' + (course.price || '') + ')',
    metaDesc: courseTitle + ' — ' + courseName + ' by Growing Up Nepal. ' + (course.description || '') + ' Earn 65% referral commission. Enroll now.',
    ogTitle: courseTitle + ' — ' + courseName + ' — Growing Up',
    ogDesc: (course.description || '') + ' Enroll in ' + courseName + ' at Growing Up Nepal.'
  });
});

// GET - Register page
router.get('/register', (req, res) => {
  // If already logged in, send them somewhere useful instead of showing the form
  if (req.session && req.session.userId) {
    if (req.session.role === 'superadmin' || req.session.role === 'financial_secretary') {
      return res.redirect('/admin');
    }
    return res.redirect('/dashboard');
  }
  const ref = req.query.ref || '';
  const course = req.query.course || '';
  res.render('register', {
    courses, ref, selectedCourse: course,
    currentPath: '/register',
    title: 'Register — Start Earning with Referrals',
    metaDesc: 'Create your Growing Up account. Join Nepal\'s best affiliate marketing platform. Buy a course, share your link, earn 65% commission.',
    ogTitle: 'Register — Growing Up Nepal',
    ogDesc: 'Join Growing Up Nepal — the best affiliate marketing platform. Buy a course, earn 65% referral commission.'
  });
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
    const { firstName, middleName, lastName, whatsapp, email, gender, referralCode, pfpUrl } = req.body;

    // ── Strict input validation (defense in depth) ──
    // Names: 2-50 chars, letters/spaces/hyphens/dots/apostrophes only.
    const NAME_RE = /^[\p{L}\s.\-']{2,50}$/u;
    if (!firstName || !NAME_RE.test(String(firstName).trim())) {
      return res.status(400).json({ error: 'First name must be 2-50 letters.' });
    }
    if (middleName && !NAME_RE.test(String(middleName).trim())) {
      return res.status(400).json({ error: 'Middle name must be 2-50 letters (or leave blank).' });
    }
    if (!lastName || !NAME_RE.test(String(lastName).trim())) {
      return res.status(400).json({ error: 'Last name must be 2-50 letters.' });
    }

    // Email: real email regex, max 254 chars
    const cleanEmail = String(email || '').trim().toLowerCase().substring(0, 254);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail) || cleanEmail.length > 254) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    // WhatsApp: exactly 10 digits (Nepal mobile)
    const cleanPhone = String(whatsapp || '').trim();
    if (!/^\d{10}$/.test(cleanPhone)) {
      return res.status(400).json({ error: 'WhatsApp number must be exactly 10 digits.' });
    }

    // Gender: M or F
    if (!['M', 'F'].includes(String(gender || ''))) {
      return res.status(400).json({ error: 'Please select your gender.' });
    }

    // Referral code: no strict regex — we just check whether the
    // code exists in the DB. The DB lookup (with case-insensitive
    // match) is the only real validation. This is friendlier to
    // users with codes of unusual length (e.g. superadmin "ADMIN"
    // is 5 chars; auto-generated codes can be 7-12).
    const cleanRef = String(referralCode || '').trim();
    if (!cleanRef) {
      return res.status(400).json({ error: 'Referral code is required.' });
    }

    // PFP: only accept a Cloudinary URL
    const cleanPfp = (typeof pfpUrl === 'string' && /^https:\/\/res\.cloudinary\.com\/[a-z0-9-]+\/image\/upload\//.test(pfpUrl))
      ? pfpUrl.substring(0, 500)
      : '';

    // Check if email already exists
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Validate referral code (case-insensitive lookup)
    const referrer = await User.findOne({
      referralCode: { $regex: '^' + cleanRef.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', $options: 'i' },
      isActive: true
    });
    if (!referrer) {
      return res.status(400).json({ error: 'Referral code not found. Please check the code and try again.' });
    }

    // Store step 1 data in session
    req.session.registration = {
      firstName: firstName.trim(),
      middleName: (middleName || '').trim(),
      lastName: lastName.trim(),
      whatsapp: cleanPhone,
      email: cleanEmail,
      gender,
      referrerId: referrer._id,
      referralCode: cleanRef,
      pfpUrl: cleanPfp
    };

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST - Temp PFP upload during signup (user doesn't exist yet).
// Stores a Cloudinary URL in the session so step 3 can attach it to the new account.
router.post('/api/register/upload-temp-pfp', upload.single('pfp'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No image received.' });
  }
  try {
    const id = tempId();
    const result = await uploadPfp(req.file.buffer, 'tmp-' + id);
    return res.json({ success: true, url: result.secure_url });
  } catch (err) {
    console.error('Temp PFP upload error:', err.message);
    return res.status(500).json({ success: false, error: 'Could not upload image. Try again or skip.' });
  }
});

// POST - Step 2: Payment screenshot upload
// The screenshot is uploaded to Cloudinary and the secure URL is stored in the session
// and on the Payment + User.purchasedCourses records, so admins always have a viewable
// link — no base64 blobs in the DB.
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

    // Upload proof to Cloudinary (uses a temp id; we re-key after the user is created)
    const proofId = tempId();
    const proof = await uploadPaymentProof(req.file.buffer, proofId);

    req.session.registration.courseKey = courseKey;
    req.session.registration.courseName = course.name;
    req.session.registration.price = course.price;
    req.session.registration.screenshot = proof.secure_url; // Cloudinary URL
    req.session.registration.transactionId = transactionId || '';

    return res.json({ success: true });
  } catch (err) {
    console.error('Step 2 upload error:', err.message);
    return res.status(500).json({ error: 'Could not upload payment proof. Please try again.' });
  }
});

// POST - Step 3: Set password & create account
router.post('/api/register/step3', async (req, res) => {
  try {
    if (!req.session.registration || !req.session.registration.screenshot) {
      return res.status(400).json({ error: 'Please complete previous steps first' });
    }

    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const reg = req.session.registration;
    const hashedPassword = await bcrypt.hash(password, 12);

    // PFP: only accept https://res.cloudinary.com/... URLs (set during step 1 upload).
    // Empty string is fine — PFP is optional.
    const validPfp = (typeof reg.pfpUrl === 'string' && reg.pfpUrl.startsWith('https://res.cloudinary.com/'))
      ? reg.pfpUrl
      : '';

    const user = new User({
      firstName: reg.firstName,
      middleName: reg.middleName,
      lastName: reg.lastName,
      email: reg.email,
      whatsapp: reg.whatsapp,
      gender: reg.gender,
      password: hashedPassword,
      profilePicture: validPfp,
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

// POST - Change profile picture (logged-in user)
router.post('/api/profile/upload-pfp', upload.single('pfp'), async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ success: false, error: 'Please login first' });
  }
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No image received.' });
  }
  try {
    const result = await uploadPfp(req.file.buffer, String(req.session.userId));
    await User.findByIdAndUpdate(req.session.userId, { profilePicture: result.secure_url });
    return res.json({ success: true, url: result.secure_url, message: 'Profile photo updated' });
  } catch (err) {
    console.error('PFP upload error:', err.message);
    return res.status(500).json({ success: false, error: 'Could not upload image. Please try again.' });
  }
});

// POST - Remove profile picture (revert to initials)
router.post('/api/profile/remove-pfp', async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ success: false, error: 'Please login first' });
  }
  try {
    await User.findByIdAndUpdate(req.session.userId, { profilePicture: '' });
    return res.json({ success: true, message: 'Profile photo removed' });
  } catch (err) {
    console.error('PFP remove error:', err.message);
    return res.status(500).json({ success: false, error: 'Could not remove photo.' });
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
  res.render('login', {
    currentPath: '/login',
    title: 'Login',
    metaDesc: 'Login to your Growing Up account. Access your courses, referral earnings, and dashboard.',
    ogTitle: 'Login — Growing Up',
    ogDesc: 'Login to your Growing Up account. Access courses, referrals, and earnings dashboard.'
  });
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
      // Account is pending admin approval — show message on login page
      return res.status(403).json({
        error: 'Your account hasn\'t been activated yet.',
        pending: true
      });
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

  const baseUrl = 'https://www.growingup.tech';
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

    // Amount must be valid positive integer >= 1
    const requestedAmount = parseInt(amount, 10);
    if (!requestedAmount || isNaN(requestedAmount) || requestedAmount < 1) {
      return res.status(400).json({ success: false, message: 'Withdrawal amount must be at least ₹1.' });
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
    if (!amt || amt < 1) return res.status(400).json({ success: false, message: 'Enter a valid amount.' });

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

// GET - User profile (renders profile view with full account details)
router.get('/profile', async (req, res) => {
  if (!req.session || !req.session.userId) return res.redirect('/login');
  try {
    const user = await User.findById(req.session.userId)
      .populate('referredBy', 'firstName lastName referralCode')
      .populate('referredUsers', 'firstName lastName email isActive')
      .populate('purchasedCourses')
      .select('+totalEarnings +walletBalance +withdrawnAmount +rejectionReason');
    if (!user) return res.redirect('/logout');

    // Per-course completion progress: { [courseKey]: { moduleCount, completedCount, allComplete } }
    const courseProgress = {};
    if (user.purchasedCourses && user.purchasedCourses.length > 0) {
      user.purchasedCourses.forEach(function(c) {
        const total = getModuleCount(c.courseKey);
        const done = (c.completedModules && c.completedModules.length) || 0;
        courseProgress[c.courseKey] = {
          moduleCount: total,
          completedCount: done,
          allComplete: total > 0 && done >= total
        };
      });
    }

    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    res.render('profile', { user, baseUrl, courseProgress });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).send('Server error');
  }
});

// GET - Certificate of completion (per course)
// Gated on course ownership + completion (completedAt in DB).
// Completion is synced from localStorage to DB via /api/course/:key/complete.
router.get('/certificate/:courseKey', async (req, res) => {
  if (!req.session || !req.session.userId) return res.redirect('/login');
  const courseKey = req.params.courseKey;
  const course = courses[courseKey];
  if (!course) return res.status(404).send('Course not found');
  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.redirect('/logout');
    const entry = user.purchasedCourses && user.purchasedCourses.find(c => c.courseKey === courseKey && c.status === 'approved');
    const isAdmin = user.role === 'superadmin' || user.role === 'financial_secretary';
    if (!entry && !isAdmin) {
      return res.status(403).send('You need to own this course to get a certificate.');
    }
    // Must have completedAt (set by sync endpoint) unless admin
    if (!isAdmin && (!entry || !entry.completedAt)) {
      return res.redirect('/course/' + courseKey + '/read');
    }

    // Stable, deterministic cert id: GU-{courseKey 3}-{userId last 6}
    const short = String(user._id).slice(-6).toUpperCase();
    const ck = courseKey.toUpperCase().slice(0, 3);
    const certId = `${ck}-${short}`;
    const issuedAt = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    res.render('certificate', { user, course, certId, issuedAt });
  } catch (err) {
    console.error('Certificate error:', err);
    res.status(500).send('Server error');
  }
});

// GET - Download certificate as a standalone HTML file (the user can open it
// in any browser and use "Print → Save as PDF" for a real PDF download).
// Same auth + ownership + completion gates as the render route.
router.get('/certificate/:courseKey/download', async (req, res) => {
  if (!req.session || !req.session.userId) return res.redirect('/login');
  const courseKey = req.params.courseKey;
  const course = courses[courseKey];
  if (!course) return res.status(404).send('Course not found');
  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.redirect('/logout');
    const entry = user.purchasedCourses && user.purchasedCourses.find(c => c.courseKey === courseKey && c.status === 'approved');
    const isAdmin = user.role === 'superadmin' || user.role === 'financial_secretary';
    if (!entry && !isAdmin) {
      return res.status(403).send('You need to own this course to get a certificate.');
    }
    if (!isAdmin && (!entry || !entry.completedAt)) {
      return res.redirect('/course/' + courseKey + '/read');
    }
    const short = String(user._id).slice(-6).toUpperCase();
    const ck = courseKey.toUpperCase().slice(0, 3);
    const certId = `${ck}-${short}`;
    const issuedAt = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    res.render('certificate', { user, course, certId, issuedAt, downloadMode: true });
  } catch (err) {
    console.error('Certificate download error:', err);
    res.status(500).send('Server error');
  }
});

// Alias — keep old /dashboard/profile URL working
router.get('/dashboard/profile', (req, res) => {
  if (!req.session || !req.session.userId) return res.redirect('/login');
  res.redirect('/profile');
});

// GET - Account settings (edit WhatsApp, middle name; change password)
router.get('/settings', async (req, res) => {
  if (!req.session || !req.session.userId) return res.redirect('/login');
  try {
    const user = await User.findById(req.session.userId)
      .select('firstName middleName lastName email whatsapp createdAt role');
    if (!user) return res.redirect('/logout');
    res.render('settings', { user });
  } catch (err) {
    console.error('Settings error:', err);
    res.status(500).send('Server error');
  }
});

// POST - Update profile fields (WhatsApp, middle name)
router.post('/api/profile/update', async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ success: false, error: 'Please login first' });
  }
  try {
    const { whatsapp, middleName } = req.body;
    const update = {};

    // WhatsApp: optional in payload, but if present must be 10 digits
    if (typeof whatsapp !== 'undefined') {
      const clean = String(whatsapp).trim();
      if (!/^\d{10}$/.test(clean)) {
        return res.status(400).json({ success: false, error: 'WhatsApp number must be exactly 10 digits.' });
      }
      update.whatsapp = clean;
    }

    // Middle name: optional, max 50 chars
    if (typeof middleName !== 'undefined') {
      const clean = String(middleName).trim().substring(0, 50);
      update.middleName = clean;
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ success: false, error: 'No changes to save.' });
    }

    await User.findByIdAndUpdate(req.session.userId, update);
    return res.json({ success: true, message: 'Profile updated' });
  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST - Change password (requires current password)
router.post('/api/profile/change-password', async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ success: false, error: 'Please login first' });
  }
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || typeof currentPassword !== 'string') {
      return res.status(400).json({ success: false, error: 'Current password is required.' });
    }
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'New password must be at least 6 characters.' });
    }
    if (newPassword === currentPassword) {
      return res.status(400).json({ success: false, error: 'New password must be different from your current one.' });
    }

    const user = await User.findById(req.session.userId).select('+password');
    if (!user) return res.status(404).json({ success: false, error: 'Account not found.' });

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect.' });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return res.json({ success: true, message: 'Password updated' });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
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


// GET - My Certificates (lists every course the user has completed,
// with view + download links). Public-facing link in the nav.
router.get('/certificates', async (req, res) => {
  if (!req.session || !req.session.userId) return res.redirect('/login');
  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.redirect('/logout');

    // Build a list of completed courses from DB (completedAt is set by
    // the /api/course/:key/complete endpoint when all modules are done).
    const short = String(user._id).slice(-6).toUpperCase();
    const completed = (user.purchasedCourses || [])
      .filter(c => c.status === 'approved' && c.completedAt)
      .map(c => {
        const ck = (c.courseKey || '').toUpperCase().slice(0, 3);
        return {
          courseKey: c.courseKey,
          courseName: c.courseName,
          completedAt: c.completedAt,
          certId: `${ck}-${short}`,
          granted: !!c.grantedBy
        };
      });

    // Also pass ALL purchased courses (approved, not yet completed) so the
    // client can check localStorage and sync completions that predate the DB
    // sync feature.
    const approved = (user.purchasedCourses || [])
      .filter(c => c.status === 'approved' && !c.completedAt)
      .map(c => ({
        courseKey: c.courseKey,
        courseName: c.courseName,
        moduleCount: getModuleCount(c.courseKey)
      }));

    // Pass module counts for ALL courses so client can check localStorage
    const moduleCounts = {};
    Object.keys(courses).forEach(k => { moduleCounts[k] = getModuleCount(k); });

    res.render('certificates', {
      user, completed, approved, moduleCounts,
      baseUrl: process.env.BASE_URL || 'https://www.growingup.tech',
      currentPath: '/certificates',
      title: 'My Certificates',
      metaDesc: 'View and download your Growing Up course completion certificates. Verify certificate authenticity with unique IDs.',
      ogTitle: 'My Certificates — Growing Up',
      ogDesc: 'View and download your Growing Up course completion certificates.'
    });
  } catch (err) {
    console.error('Certificates list error:', err);
    res.status(500).send('Server error');
  }
});

// API - Get completed certificates (used by certificates page as fallback).
router.get('/api/certificates', async (req, res) => {
  if (!req.session || !req.session.userId) return res.status(401).json({ error: 'Not logged in' });
  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const short = String(user._id).slice(-6).toUpperCase();
    const completed = (user.purchasedCourses || [])
      .filter(c => c.status === 'approved' && c.completedAt)
      .map(c => {
        const ck = (c.courseKey || '').toUpperCase().slice(0, 3);
        return {
          courseKey: c.courseKey,
          courseName: c.courseName,
          completedAt: c.completedAt,
          certId: `${ck}-${short}`,
          granted: !!c.grantedBy
        };
      });
    const approved = (user.purchasedCourses || [])
      .filter(c => c.status === 'approved' && !c.completedAt)
      .map(c => ({
        courseKey: c.courseKey,
        courseName: c.courseName,
        moduleCount: getModuleCount(c.courseKey)
      }));
    res.json({ completed, approved });
  } catch (err) {
    console.error('API certificates error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// GET - Public certificate verification (no login required).
// Two routes:
//   GET /verify              → landing page with an input form
//   GET /verify/:certId      → show the verified cert, or "not found"
//
// The cert id format is `{courseKey3}-{userIdLast6}` (uppercase),
// e.g. STA-AB12CD for a starter-course completion. We don't index
// on it; we look up by trailing _id match (O(N) but N is small and
// we rate-limit this endpoint). To avoid leaking partial info, we
// always render the same "not found" page on any failure.
const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 attempts per 15 min per IP — generous for hand-typed IDs
  message: { error: 'Too many verification attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

router.get('/verify', (req, res) => {
  res.render('verify', {
    result: null, certId: '',
    currentPath: '/verify',
    title: 'Verify Certificate — Growing Up',
    metaDesc: 'Verify a Growing Up certificate. Enter a certificate ID to confirm course completion and authenticity.',
    ogTitle: 'Verify Certificate — Growing Up Nepal',
    ogDesc: 'Verify a Growing Up certificate. Confirm course completion and authenticity instantly.'
  });
});

router.get('/verify/:certId', verifyLimiter, async (req, res) => {
  // Normalize: trim, strip non-alnum/dash, uppercase
  const raw = String(req.params.certId || '').trim();
  const certId = raw.toUpperCase().replace(/[^A-Z0-9-]/g, '').substring(0, 32);
  if (!certId) {
    return res.render('verify', {
      result: null, certId: '',
      currentPath: '/verify',
      title: 'Verify Certificate — Growing Up',
      metaDesc: 'Verify a Growing Up certificate. Enter a certificate ID to confirm course completion and authenticity.',
      ogTitle: 'Verify Certificate — Growing Up Nepal',
      ogDesc: 'Verify a Growing Up certificate. Confirm course completion and authenticity instantly.'
    });
  }

  try {
    // Parse cert ID. Two formats accepted:
    //   GU-{COURSE3}-{USER6}  (full format from certificate page)
    //   {COURSE3}-{USER6}     (short format)
    // The GU- prefix is optional; after normalization we strip it if present.
    let parseId = certId;
    if (parseId.startsWith('GU-')) parseId = parseId.substring(3);
    const m = parseId.match(/^([A-Z]{3})-([A-Z0-9]{6})$/);
    if (!m) {
      return res.render('verify', { result: { valid: false }, certId });
    }
    const coursePrefix = m[1];
    const userTail = m[2];

    // Find the course whose 3-char prefix matches
    const courseEntry = Object.entries(courses).find(([k]) =>
      k.toUpperCase().slice(0, 3) === coursePrefix
    );
    if (!courseEntry) {
      return res.render('verify', { result: { valid: false }, certId });
    }
    const [courseKey, course] = courseEntry;

    // Find the user whose _id ends with the user tail (case-insensitive
    // since ObjectId hex is uppercase by default, but we normalize)
    const tailLower = userTail.toLowerCase();
    // We can't use $regex on a 4-byte BSON string with $endsWith directly,
    // so we pull a small candidate set and filter in JS. For larger
    // deployments, add a derived `certTail` field to the User model.
    const candidates = await User.find({
      role: { $in: ['user', 'financial_secretary'] },
      'purchasedCourses': {
        $elemMatch: { courseKey, status: 'approved', completedAt: { $ne: null } }
      }
    })
      .select('firstName middleName lastName purchasedCourses referralCode')
      .limit(500);

    const match = candidates.find(u => String(u._id).slice(-6).toUpperCase() === userTail);
    if (!match) {
      return res.render('verify', { result: { valid: false }, certId });
    }
    const entry = match.purchasedCourses.find(c =>
      c.courseKey === courseKey && c.status === 'approved' && c.completedAt
    );
    if (!entry) {
      return res.render('verify', { result: { valid: false }, certId });
    }

    return res.render('verify', {
      result: {
        valid: true,
        certId,
        courseKey,
        courseName: course.name,
        courseTitle: course.title,
        holderName: match.fullName,
        issuedAt: entry.completedAt,
        granted: !!entry.grantedBy
      },
      certId,
      currentPath: '/verify/' + certId,
      title: 'Certificate Verified — ' + course.title + ' — Growing Up',
      metaDesc: 'Certificate GU-' + certId + ' verified. ' + match.fullName + ' completed ' + course.name + ' at Growing Up Nepal.',
      ogTitle: 'Certificate Verified — Growing Up Nepal',
      ogDesc: match.fullName + ' completed ' + course.name + ' (' + course.title + ') at Growing Up Nepal. Certificate ID: GU-' + certId
    });
  } catch (err) {
    console.error('Verify cert error:', err);
    return res.render('verify', { result: { valid: false }, certId });
  }
});


// GET - Read Course (only for owned courses)
router.get('/course/:key/read', async (req, res) => {
  if (!req.session || !req.session.userId) return res.redirect('/login');
  const courseKey = req.params.key;
  const course = courses[courseKey];
  if (!course) return res.redirect('/');

  try {
    const user = await User.findById(req.session.userId);
    const isAdminRole = user && (user.role === 'superadmin' || user.role === 'financial_secretary');
    if (!user || (!user.isActive && !isAdminRole)) return res.redirect('/pending');
    // Check if user owns this course (approved only) unless admin
    if (!isAdminRole) {
      const owned = user.purchasedCourses.some(c => c.courseKey === courseKey && c.status === 'approved');
      if (!owned) return res.status(403).render('404', { message: 'You do not have access to this course.' });
    }

    const modules = getModules(courseKey);
    const entry = user.purchasedCourses.find(c => c.courseKey === courseKey);
    const completedModules = (entry && entry.completedModules) || [];
    const moduleCount = modules.length;
    const completedCount = completedModules.length;
    const allComplete = moduleCount > 0 && completedCount >= moduleCount;

    res.render('course-read', {
      course,
      loggedInUser: user,
      courseKey,
      modules,
      completedModules,
      moduleCount,
      completedCount,
      allComplete,
      certLocked: req.query.cert === 'locked',
      currentPath: '/course/' + courseKey + '/read',
      title: 'Learn: ' + (course.title || courseKey) + ' — Growing Up',
      metaDesc: 'Access ' + (course.name || courseKey) + ' course content. ' + moduleCount + ' modules, lifetime access. Part of Growing Up Nepal — the best affiliate marketing platform.',
      ogTitle: 'Learn: ' + (course.title || courseKey) + ' — Growing Up',
      ogDesc: 'Access ' + (course.name || courseKey) + ' course content. ' + moduleCount + ' modules, lifetime access.'
    });
  } catch (err) {
    console.error('course-read error:', err);
    return res.status(500).render('404', { message: 'Server error.' });
  }
});

// POST - Sync course completion to DB (save certificate ownership).
// Called from the client when all modules are marked complete in
// localStorage. Idempotent — if completedAt is already set, no-op.
// Body: { courseKey: string }
router.post('/api/course/:key/complete', async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ success: false, error: 'Please login' });
  }
  const courseKey = req.params.key;
  if (!courses[courseKey]) {
    return res.status(404).json({ success: false, error: 'Course not found' });
  }
  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).json({ success: false, error: 'Account not found' });
    const entry = user.purchasedCourses.find(c => c.courseKey === courseKey);
    if (!entry) return res.status(403).json({ success: false, error: 'Course not owned' });
    // Auto-approve if status is still pending (course was purchased but not yet approved)
    if (entry.status !== 'approved') {
      entry.status = 'approved';
    }
    if (!entry.completedAt) {
      entry.completedAt = new Date();
    }
    await user.save();
    return res.json({ success: true, completedAt: entry.completedAt });
  } catch (err) {
    console.error('Course complete sync error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST - Delete a certificate (clear completion from DB).
// Body: { courseKey: string }
router.post('/api/course/:key/delete-cert', async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ success: false, error: 'Please login' });
  }
  const courseKey = req.params.key;
  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).json({ success: false, error: 'Account not found' });
    const entry = user.purchasedCourses.find(c => c.courseKey === courseKey);
    if (!entry) return res.status(404).json({ success: false, error: 'Course not found' });
    entry.completedAt = undefined;
    await user.save();
    return res.json({ success: true });
  } catch (err) {
    console.error('Delete cert error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST - Toggle a module's completion for a course the user owns.
// Body: { moduleId: <int> }
// Response: { success, completedModules, completedCount, moduleCount, allComplete }
router.post('/api/course/:key/module/toggle', async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ success: false, error: 'Please login first' });
  }
  const courseKey = req.params.key;
  if (!courses[courseKey]) {
    return res.status(404).json({ success: false, error: 'Course not found' });
  }

  const moduleId = parseInt(req.body.moduleId, 10);
  const moduleCount = getModuleCount(courseKey);
  if (!moduleId || moduleId < 1 || moduleId > moduleCount) {
    return res.status(400).json({ success: false, error: 'Invalid module id' });
  }

  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).json({ success: false, error: 'Account not found' });

    const isAdminRole = user.role === 'superadmin' || user.role === 'financial_secretary';
    const owned = user.purchasedCourses.some(c => c.courseKey === courseKey && c.status === 'approved');
    if (!owned && !isAdminRole) {
      return res.status(403).json({ success: false, error: 'You do not own this course' });
    }

    // Find the matching course entry (admin role with no entry = use a temp in-memory model)
    let entry = user.purchasedCourses.find(c => c.courseKey === courseKey);
    let needsSave = false;

    if (!entry && isAdminRole) {
      // Admin previewing: don't persist
      const fakeCompleted = [moduleId];
      return res.json({
        success: true,
        completedModules: fakeCompleted,
        completedCount: 1,
        moduleCount,
        allComplete: moduleCount === 1,
        preview: true
      });
    }

    if (!entry) {
      return res.status(403).json({ success: false, error: 'You do not own this course' });
    }

    // Initialize completedModules if missing (defensive — schema has default [])
    if (!Array.isArray(entry.completedModules)) entry.completedModules = [];

    const idx = entry.completedModules.indexOf(moduleId);
    if (idx === -1) {
      entry.completedModules.push(moduleId);
      entry.completedModules.sort((a, b) => a - b);
    } else {
      entry.completedModules.splice(idx, 1);
    }

    const completedCount = entry.completedModules.length;
    const allComplete = moduleCount > 0 && completedCount >= moduleCount;

    // Set or clear completedAt based on full-course completion
    if (allComplete && !entry.completedAt) {
      entry.completedAt = new Date();
      needsSave = true;
    } else if (!allComplete && entry.completedAt) {
      entry.completedAt = null;
      needsSave = true;
    } else if (allComplete) {
      needsSave = true;
    } else {
      needsSave = true;
    }

    if (needsSave) await user.save();

    return res.json({
      success: true,
      completedModules: entry.completedModules,
      completedCount,
      moduleCount,
      allComplete
    });
  } catch (err) {
    console.error('Module toggle error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
