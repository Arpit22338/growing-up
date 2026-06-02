#!/usr/bin/env node
/**
 * Admin Cleanup — Removes all superadmin/financial_secretary users EXCEPT
 * the safe admin email(s) you whitelist.
 *
 * SAFETY:
 *   - DRY-RUN by default. Pass --confirm to actually delete.
 *   - Backs up the affected user documents to JSON before deletion.
 *   - Never logs the MongoDB password.
 *
 * Usage:
 *   MONGODB_URI="mongodb+srv://..." node scripts/cleanup-admins.js
 *   MONGODB_URI="mongodb+srv://..." node scripts/cleanup-admins.js --confirm
 */

try { require('dotenv').config(); } catch (e) { /* dotenv optional */ }
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');

const SAFE_EMAILS = ['arpitkaflee@gmail.com'].map(e => e.toLowerCase());

const confirm = process.argv.includes('--confirm');
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('ERROR: MONGODB_URI env var is required.');
  console.error('Usage:  MONGODB_URI="..." node scripts/cleanup-admins.js [--confirm]');
  process.exit(1);
}

const maskedUri = uri.replace(/:[^:@/]+@/, ':***@');

function log(msg) { console.log(`[${new Date().toISOString()}] ${msg}`); }

(async () => {
  try {
    log(`Connecting to ${maskedUri}`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    log('Connected.');

    const allAdmins = await User.find({
      role: { $in: ['superadmin', 'financial_secretary'] }
    }).select('email firstName lastName role isActive createdAt').lean();

    log(`Found ${allAdmins.length} admin/financial_secretary account(s) total.`);

    const safe = allAdmins.filter(u => SAFE_EMAILS.includes((u.email || '').toLowerCase()));
    const toDelete = allAdmins.filter(u => !SAFE_EMAILS.includes((u.email || '').toLowerCase()));

    log(`\n=== SAFE (will be kept) ===`);
    if (safe.length === 0) {
      log('  (none)  WARNING: no safe admin found — aborting.');
      process.exit(2);
    }
    safe.forEach(u => log(`  ✓  ${u.email}  (${u.role})  ${u.firstName} ${u.lastName || ''}`));

    log(`\n=== TO DELETE (${toDelete.length}) ===`);
    if (toDelete.length === 0) {
      log('  (none)  Nothing to do.');
      await mongoose.disconnect();
      return;
    }
    toDelete.forEach(u => log(`  ✗  ${u.email}  (${u.role})  ${u.firstName} ${u.lastName || ''}  created=${u.createdAt ? new Date(u.createdAt).toISOString().slice(0,10) : 'n/a'}  active=${u.isActive}`));

    // Backup
    const backupDir = path.join(__dirname, '..', 'backups');
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `admins-backup-${stamp}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(toDelete, null, 2));
    log(`\nBackup written to: ${backupFile}`);

    // Dependent data counts (informational only — not deleted here)
    const Payment = require('../models/Payment');
    const Withdrawal = require('../models/Withdrawal');
    for (const u of toDelete) {
      const payments = await Payment.countDocuments({ user: u._id });
      const withdrawals = await Withdrawal.countDocuments({ user: u._id });
      log(`  refs for ${u.email}: payments=${payments}, withdrawals=${withdrawals}`);
    }

    if (!confirm) {
      log(`\nDRY-RUN complete. No changes made.`);
      log(`To actually delete, re-run with --confirm:`);
      log(`  MONGODB_URI="..." node scripts/cleanup-admins.js --confirm`);
      await mongoose.disconnect();
      return;
    }

    log(`\n--confirm flag set. Deleting ${toDelete.length} account(s)...`);
    const result = await User.deleteMany({
      _id: { $in: toDelete.map(u => u._id) }
    });
    log(`Deleted ${result.deletedCount} account(s).`);

    log(`\nRemaining admins:`);
    const remaining = await User.find({ role: { $in: ['superadmin', 'financial_secretary'] } })
      .select('email role firstName lastName').lean();
    remaining.forEach(u => log(`  ${u.email}  (${u.role})  ${u.firstName} ${u.lastName || ''}`));

    await mongoose.disconnect();
    log('Done.');
  } catch (err) {
    console.error('ERROR:', err.message);
    if (err.stack) console.error(err.stack);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(1);
  }
})();
