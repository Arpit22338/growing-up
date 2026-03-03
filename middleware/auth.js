// Authentication & Role-based Access Middleware
// All admin checks verify against DB to prevent session tampering / privilege escalation

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
      return res.redirect('/admin/login');
    }
    const user = await User.findById(req.session.userId).select('role isActive');
    if (!user || !user.isActive) {
      req.session.destroy();
      return res.redirect('/admin/login');
    }
    if (user.role !== 'superadmin' && user.role !== 'financial_secretary') {
      return res.status(403).send('Access denied');
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
      return res.redirect('/admin/login');
    }
    const user = await User.findById(req.session.userId).select('role isActive');
    if (!user || !user.isActive) {
      req.session.destroy();
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

function isActiveUser(req, res, next) {
  if (req.session && req.session.isActive) {
    return next();
  }
  return res.redirect('/pending');
}

module.exports = { isAuthenticated, isAdmin, isSuperAdmin, isFinancialSecretary, isActiveUser };
