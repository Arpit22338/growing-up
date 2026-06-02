// Manual runner for the cron cleanup job — used in local dev.
// In production, Vercel Cron hits /api/cron/cleanup directly.
//
// Usage:  npm run cron
require('dotenv').config();
const http = require('http');

const PORT = process.env.PORT || 3000;
const SECRET = process.env.CRON_SECRET;

if (!SECRET) {
  console.error('CRON_SECRET is not set in your .env');
  process.exit(1);
}

const url = `http://localhost:${PORT}/api/cron/cleanup?secret=${encodeURIComponent(SECRET)}`;
console.log('Triggering cron cleanup at', url);

http.get(url, (res) => {
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Body:  ', body);
    process.exit(res.statusCode === 200 ? 0 : 1);
  });
}).on('error', (err) => {
  console.error('Request failed:', err.message);
  console.error('Is the server running? Start it with `npm run dev` first.');
  process.exit(1);
});
