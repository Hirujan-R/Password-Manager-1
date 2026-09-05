const jwt = require('jsonwebtoken');
const csrf = require('csrf');

// Single csrf token factory/verifier instance (stateless, secret comes from env).
const tokens = new csrf();

const COOKIE_NAMES = { session: 'token', csrf: 'csrfToken' };

function cookieBase(res, name, value, { maxAgeMs } = {}) {
  const secure = process.env.COOKIE_SECURE !== 'false';
  const options = {
    httpOnly: name === COOKIE_NAMES.session, // csrf cookie must be readable by JS for double-submit
    secure,
    sameSite: 'Strict',
    path: '/',
  };
  if (maxAgeMs) options.maxAge = maxAgeMs;
  res.cookie(name, value, options);
}

function setSessionCookie(res, token) {
  cookieBase(res, COOKIE_NAMES.session, token, { maxAgeMs: 3600000 });
}

function setCsrfCookie(res, csrfToken) {
  cookieBase(res, COOKIE_NAMES.csrf, csrfToken, { maxAgeMs: 3600000 });
}

/** Log the user out by expiring both cookies (names must match the ones set at login). */
function clearAuthCookies(res) {
  Object.values(COOKIE_NAMES).forEach((name) => {
    res.cookie(name, '', {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE !== 'false',
      sameSite: 'Strict',
      path: '/',
      expires: new Date(0),
    });
  });
}

function unauthorized(res, message = 'Unauthorised') {
  return res.status(400).json({ error: message });
}

/** Requires a valid, unexpired JWT in the session cookie; sets req.user_id. */
function verifyToken(req, res, next) {
  const token = req.cookies && req.cookies[COOKIE_NAMES.session];
  if (!token) {
    console.warn('ERROR: JWT token is missing.');
    return unauthorized(res);
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user_id = decoded.user_id;
    return next();
  } catch (error) {
    console.warn('ERROR: Invalid JWT token.');
    return unauthorized(res);
  }
}

/**
 * Double-submit CSRF check: the csrf cookie value must equal the
 * X-CSRF-Token header sent by same-origin JavaScript, and must be a token we
 * issued (signed with our secret). An attacker on another origin cannot read
 * the cookie, so they cannot reproduce it in a header.
 */
function verifyCsrfToken(req, res, next) {
  const cookieToken = req.cookies && req.cookies[COOKIE_NAMES.csrf];
  const headerToken = req.headers['x-csrf-token'];
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    console.warn('ERROR: CSRF token mismatch.');
    return res.status(403).json({ error: 'CSRF validation failed' });
  }
  try {
    if (!tokens.verify(process.env.CSRF_SECRET, cookieToken)) {
      console.warn('ERROR: Invalid CSRF token.');
      return res.status(403).json({ error: 'CSRF validation failed' });
    }
    return next();
  } catch (error) {
    console.warn('ERROR: Invalid CSRF token.');
    return res.status(403).json({ error: 'CSRF validation failed' });
  }
}

/** Issue a fresh signed CSRF token (value is also placed in the csrf cookie). */
function issueCsrfToken() {
  return tokens.create(process.env.CSRF_SECRET);
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function isWeakPassword(password) {
  return !password || typeof password !== 'string' || password.length < 8;
}

module.exports = {
  COOKIE_NAMES,
  setSessionCookie,
  setCsrfCookie,
  clearAuthCookies,
  verifyToken,
  verifyCsrfToken,
  issueCsrfToken,
  normalizeEmail,
  isWeakPassword,
};
