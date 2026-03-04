require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const path = require('path');
const connectDB = require('./config/db');

const Payment = require('./models/Payment');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
const dbReady = connectDB();

// Ensure DB is connected before handling any request (critical for serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection failed:', err.message);
    res.status(500).send('Database connection failed: ' + err.message);
  }
});

// ── Security Headers (Helmet) ──
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      fontSrc: ["'self'", "https://unpkg.com", "https://fonts.gstatic.com", "data:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  noSniff: true,
  xssFilter: true,
  hidePoweredBy: true,
  ieNoOpen: true,
  dnsPrefetchControl: { allow: false },
  permittedCrossDomainPolicies: { permittedPolicies: 'none' }
}));

// ── Rate Limiting ──
// Global: 200 requests per 15 min per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(globalLimiter);

// Strict limiter for login/register (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/login', authLimiter);
app.use('/api/register', authLimiter);

// Admin routes: stricter limit
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Too many admin requests. Slow down.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/admin', adminLimiter);

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', 1); // Trust first proxy (Vercel/Nginx)

// Body parsing with size limits (2mb for profile picture uploads as base64)
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Static files with cache headers
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '7d',
  etag: true
}));

// Session — secure, httpOnly, sameSite
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60 // 1 day TTL in store
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24 hours (not 7 days)
    httpOnly: true,               // Prevents JS access to cookie
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    sameSite: 'lax',              // CSRF protection
    path: '/'
  },
  name: 'gu_sid',                 // Custom session name (hide tech stack)
  rolling: true                   // Reset expiry on activity
}));

// ── CSRF Token Middleware ──
// Generate a per-session CSRF token
app.use((req, res, next) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }
  res.locals.csrfToken = req.session.csrfToken;
  next();
});

// CSRF validation for all state-changing requests (POST/PUT/DELETE)
app.use((req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();

  // Skip CSRF for file uploads (token sent as field) and API register steps
  const skipPaths = ['/api/register/step2'];
  if (skipPaths.some(p => req.path.startsWith(p))) return next();

  const token = (req.body && req.body._csrf) || req.headers['x-csrf-token'];
  if (!token || token !== req.session.csrfToken) {
    return res.status(403).json({ error: 'Invalid or missing CSRF token. Refresh the page and try again.' });
  }
  next();
});

// Make session data available to views
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// ── Extra security headers (beyond Helmet) ──
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  next();
});

// Routes
app.use('/', require('./routes/main'));
app.use('/', require('./routes/admin'));

// 404
app.use((req, res) => {
  res.status(404).render('404');
});

// Error handler
app.use((err, req, res, next) => {
  console.error('ERROR:', err.stack || err.message || err);
  const msg = process.env.NODE_ENV === 'production' ? 'Something went wrong!' : (err.message || 'Something went wrong!');
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.status(500).json({ error: msg });
  }
  res.status(500).send('Error: ' + msg);
});

// Export for Vercel serverless
module.exports = app;

// ── Auto-delete approved/rejected payments after 3 days ──
setInterval(async () => {
  try {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const result = await Payment.deleteMany({
      status: { $in: ['approved', 'rejected'] },
      updatedAt: { $lt: threeDaysAgo }
    });
    if (result.deletedCount > 0) {
      console.log(`Old payment records cleaned up: ${result.deletedCount} deleted`);
    }
  } catch (err) {
    console.error('Payment cleanup error:', err.message);
  }
}, 24 * 60 * 60 * 1000); // runs every 24 hours

// ── Reset daily withdrawal counts (check every hour) ──
setInterval(async () => {
  try {
    const today = new Date().toDateString();
    const result = await User.updateMany(
      { lastWithdrawalDate: { $ne: today }, dailyWithdrawCount: { $gt: 0 } },
      { $set: { dailyWithdrawCount: 0 } }
    );
    if (result.modifiedCount > 0) {
      console.log(`Daily withdrawal counts reset for ${result.modifiedCount} users`);
    }
  } catch (err) {
    console.error('Daily withdrawal reset error:', err.message);
  }
}, 60 * 60 * 1000); // runs every hour

// Only listen when running locally (not on Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Growing Up server running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
  });
}
