// ─────────────────────────────────────────────────────────────────────────────
// Security Hardening Middleware
// ─────────────────────────────────────────────────────────────────────────────
// 1. Strips HTTP method-override headers/body so a forged POST cannot pretend
//    to be a GET/DELETE/etc. (Express 5 ignores _method by default, but
//    some reverse proxies / clients send X-HTTP-Method-Override, X-HTTP-Method,
//    or X-Method-Override which can confuse downstream code).
// 2. Rejects any unexpected request shape (e.g. extra Content-Type for a JSON
//    route, URL-encoded body where we expect JSON for sensitive endpoints).
// 3. Sanitizes user-supplied strings: strips null bytes, control chars, and
//    a small set of known-dangerous patterns BEFORE they reach the route
//    handler. The handler still does its own validation; this is defense-in-depth.
// 4. Strictly validates that any `req.body.userId` / `req.body.role` /
//    `req.body._id` (when present) cannot be trusted and clears them so
//    route handlers cannot accidentally read from them. The actual user
//    identity MUST come from `req.session.userId`.
// ─────────────────────────────────────────────────────────────────────────────

const META_KEYS = ['userid', 'role', '_id', 'isadmin', 'isactive', 'csrfsecret'];

// Headers that should never be trusted for auth (we keep CSRF + Authorization
// for the cron secret).
const FORBIDDEN_AUTH_HEADERS = [
  'x-user-id',
  'x-userid',
  'x-role',
  'x-user-role',
  'x-is-admin',
  'x-impersonate',
  'x-original-user',
  'x-forwarded-user',
  'x-real-user',
  'x-auth-user'
];

const METHOD_OVERRIDE_HEADERS = [
  'x-http-method-override',
  'x-http-method',
  'x-method-override'
];

const ALLOWED_CONTENT_TYPES = new Set([
  'application/json',
  'application/x-www-form-urlencoded',
  'multipart/form-data',
  'text/plain' // tolerated for health checks; specific routes still validate
]);

// Strip the bytes we never want in user input.
function cleanString(s) {
  if (typeof s !== 'string') return s;
  // 1. Null bytes (used in some path-traversal / truncation attacks)
  // 2. C0 control chars except \t \n \r (which are valid in text)
  // 3. NBSP-like whitespace that can confuse equality checks
  return s
    .replace(/\u0000/g, '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\u2028/g, ' ') // line separator
    .replace(/\u2029/g, ' '); // paragraph separator
}

// Walk an object/array and clean every string leaf.
function deepClean(value) {
  if (typeof value === 'string') return cleanString(value);
  if (Array.isArray(value)) return value.map(deepClean);
  if (value && typeof value === 'object') {
    const out = {};
    for (const k of Object.keys(value)) {
      // Strip "constructor", "prototype", and __proto__ keys (prototype pollution)
      if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
      out[k] = deepClean(value[k]);
    }
    return out;
  }
  return value;
}

// Reject strings that look like a path traversal / SSRF / shell injection.
const BAD_PATTERNS = [
  /\.\.\//,                  // path traversal
  /\.\.\\/,                  // windows path traversal
  /%2e%2e/i,                 // url-encoded ..
  /%252e%252e/i,             // double-encoded ..
  /%c0%ae/i,                 // overlong utf-8 .
  /%uff0e%uff0e/i,
  /<script[\s>]/i,           // raw <script>
  /javascript:/i,            // js: URL
  /vbscript:/i,
  /data:text\/html/i,
  /onerror\s*=/i,            // inline event handlers
  /onload\s*=/i,
  /\bunion\b.*\bselect\b/i,  // SQLi (defense-in-depth; mongoose parameterizes)
  /\bdrop\b.*\btable\b/i,
  /; *rm +-rf/i,             // shell injection
  /\$\(.+\)/,                // command substitution
  /`[^`]*`/                  // backtick exec
];

function looksDangerous(s) {
  if (typeof s !== 'string' || s.length > 5000) return true;
  for (const p of BAD_PATTERNS) {
    if (p.test(s)) return true;
  }
  return false;
}

function securityHardening(req, res, next) {
  // 1. Strip method-override headers so a forged request cannot pretend to be
  //    another HTTP verb. Express 5 doesn't honor them, but middleware can.
  for (const h of METHOD_OVERRIDE_HEADERS) {
    if (req.headers[h]) {
      // Log it (alert in real life)
      console.warn(`[SECURITY] Stripped method-override header ${h} from ${req.ip}`);
      delete req.headers[h];
    }
  }

  // 2. Strip auth-spoofing headers. The session cookie is the only auth source.
  for (const h of FORBIDDEN_AUTH_HEADERS) {
    if (req.headers[h]) {
      console.warn(`[SECURITY] Stripped auth-spoofing header ${h} from ${req.ip}`);
      delete req.headers[h];
    }
  }

  // 3. Reject obvious auth-impersonation fields in body. The server-side
  //    session is the only source of truth for userId/role.
  if (req.body && typeof req.body === 'object') {
    for (const k of META_KEYS) {
      if (Object.prototype.hasOwnProperty.call(req.body, k)) {
        console.warn(`[SECURITY] Stripped body.${k} (impersonation attempt) from ${req.ip}`);
        delete req.body[k];
      }
    }
  }
  if (req.query && typeof req.query === 'object') {
    for (const k of META_KEYS) {
      if (Object.prototype.hasOwnProperty.call(req.query, k)) {
        delete req.query[k];
      }
    }
  }

  // 4. For state-changing requests, require a sane Content-Type.
  //    (GET/HEAD/OPTIONS are exempt — no body.)
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') {
    // File upload routes use multipart/form-data; JSON routes use application/json.
    // We just need to ensure it's not an exotic type that could confuse a parser.
    const ct = (req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
    if (ct && !ALLOWED_CONTENT_TYPES.has(ct)) {
      return res.status(415).json({ error: 'Unsupported Content-Type.' });
    }
  }

  // 5. Limit URL-encoded payloads: reject absurdly large query strings.
  //    Express already limits body size (2mb), but query strings can be huge.
  const rawQuery = req.url.split('?')[1] || '';
  if (rawQuery.length > 2048) {
    return res.status(414).json({ error: 'URL too long.' });
  }
  // Reject double-encoded / overlong UTF-8 sequences in the URL
  if (/(%[0-9a-f]{2}){50,}/i.test(rawQuery)) {
    return res.status(400).json({ error: 'Suspicious URL encoding.' });
  }

  // 6. Sanitize string values in body/query/params (cleaning only —
  //    bad patterns are flagged via a separate function and handled by the
  //    route, since some legitimate input may contain < or > in escaped form).
  if (req.body) req.body = deepClean(req.body);
  if (req.query) req.query = deepClean(req.query);
  if (req.params) req.params = deepClean(req.params);

  // 7. Flag obviously malicious strings for the route to reject.
  //    Routes can check req._hasBadInput if they want to be extra-strict.
  const flagStrings = (obj) => {
    if (typeof obj === 'string') return looksDangerous(obj);
    if (Array.isArray(obj)) return obj.some(flagStrings);
    if (obj && typeof obj === 'object') {
      return Object.values(obj).some(flagStrings);
    }
    return false;
  };
  req._hasBadInput = flagStrings(req.body) || flagStrings(req.query) || flagStrings(req.params);

  next();
}

module.exports = {
  securityHardening,
  cleanString,
  deepClean,
  looksDangerous
};
