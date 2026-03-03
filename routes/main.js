const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Settings = require('../models/Settings');
const courses = require('../config/courses');
const multer = require('multer');

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
      loggedInUser = await User.findById(req.session.userId).select('purchasedCourses isActive referralCode');
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

    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
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
          gender: 'Male',
          password: hashed,
          role: 'superadmin',
          isActive: true
        });
        await admin.save();
      }
      // Regenerate session to prevent fixation
      const oldSession = req.session;
      req.session.regenerate((err) => {
        if (err) return res.status(500).json({ error: 'Session error' });
        req.session.userId = admin._id;
        req.session.role = 'superadmin';
        req.session.isActive = true;
        req.session.csrfToken = require('crypto').randomBytes(32).toString('hex');
        req.session.loginAt = Date.now();
        return res.json({ success: true, redirect: '/admin' });
      });
      return;
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
          gender: 'Male',
          password: hashed,
          role: 'financial_secretary',
          isActive: true
        });
        await finSec.save();
      }
      req.session.regenerate((err) => {
        if (err) return res.status(500).json({ error: 'Session error' });
        req.session.userId = finSec._id;
        req.session.role = 'financial_secretary';
        req.session.isActive = true;
        req.session.csrfToken = require('crypto').randomBytes(32).toString('hex');
        req.session.loginAt = Date.now();
        return res.json({ success: true, redirect: '/admin' });
      });
      return;
    }

    // Regular user login
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.json({ success: true, redirect: '/pending' });
    }

    // Regenerate session on login to prevent session fixation
    req.session.regenerate((err) => {
      if (err) return res.status(500).json({ error: 'Session error' });
      req.session.userId = user._id;
      req.session.role = user.role;
      req.session.isActive = user.isActive;
      req.session.csrfToken = require('crypto').randomBytes(32).toString('hex');
      req.session.loginAt = Date.now();

      if (user.role === 'superadmin' || user.role === 'financial_secretary') {
        return res.json({ success: true, redirect: '/admin' });
      }
      return res.json({ success: true, redirect: '/dashboard' });
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
    res.render('dashboard', { user, courses, baseUrl: process.env.BASE_URL });
  } catch (err) {
    res.redirect('/login');
  }
});

// GET - Logout — destroy session fully and clear cookie
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.clearCookie('gu_sid', { path: '/' });
    res.redirect('/');
  });
});

module.exports = router;
