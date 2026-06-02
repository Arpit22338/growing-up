// Authentication & Role-based Access Middleware
// SECURITY MODEL:
//   - Identity is the server-side session (MongoStore). The session ID is in an
//     httpOnly, sameSite=lax, secure (in prod) cookie. It is NOT a JWT in the
//     browser, so it cannot be read or forged from client JS.
//   - All role checks re-read the user from the DB (never trust session.role
//     alone) so a tampered/stale session cannot escalate privileges.
//   - User-specific routes MUST derive the actor from req.session.userId —
//     never from req.params.id, req.body.userId, or query strings. This
//     prevents IDOR (User A reading/modifying User B's data).

const User = require('../models/User');

function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.redirect('/login');
}

// Verify admin role from DB (not just session)
async function isAdmin(req, res, next) {
  try {
    if (!req.session || !req.session.userId) {
      if (req.method !== 'GET') return res.status(401).json({ error: 'Session expired. Please login again.' });
      return res.redirect('/admin/login');
    }
    const user = await User.findById(req.session.userId).select('role isActive');
    if (!user || !user.isActive) {
      req.session.destroy();
      if (req.method !== 'GET') return res.status(401).json({ error: 'Session expired. Please login again.' });
      return res.redirect('/admin/login');
    }
    if (user.role !== 'superadmin' && user.role !== 'financial_secretary') {
      return res.status(403).json({ error: 'Access denied' });
    }
    // Sync session role with DB (prevents stale session escalation)
    req.session.role = user.role;
    next();
  } catch (err) {
    return res.status(500).send('Server error');
  }
}

async function isSuperAdmin(req, res, next) {
  try {
    if (!req.session || !req.session.userId) {
      if (req.method !== 'GET') return res.status(401).json({ error: 'Session expired. Please login again.' });
      return res.redirect('/admin/login');
    }
    const user = await User.findById(req.session.userId).select('role isActive');
    if (!user || !user.isActive || user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Access denied. Super Admin only.' });
    }
    req.session.role = user.role;
    next();
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}

async function isFinancialSecretary(req, res, next) {
  try {
    if (!req.session || !req.session.userId) {
      if (req.method !== 'GET') return res.status(401).json({ error: 'Session expired. Please login again.' });
      return res.redirect('/admin/login');
    }
    const user = await User.findById(req.session.userId).select('role isActive');
    if (!user || !user.isActive) {
      req.session.destroy();
      if (req.method !== 'GET') return res.status(401).json({ error: 'Session expired. Please login again.' });
      return res.redirect('/admin/login');
    }
    if (user.role !== 'financial_secretary' && user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Access denied.' });
    }
    req.session.role = user.role;
    next();
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}

async function isActiveUser(req, res, next) {
  try {
    if (!req.session || !req.session.userId) return res.redirect('/login');
    const user = await User.findById(req.session.userId).select('isActive');
    if (user && user.isActive) {
      req.session.isActive = true;
      return next();
    }
    req.session.isActive = false;
    return res.redirect('/pending');
  } catch (err) {
    return res.redirect('/pending');
  }
}

module.exports = { isAuthenticated, isAdmin, isSuperAdmin, isFinancialSecretary, isActiveUser };
