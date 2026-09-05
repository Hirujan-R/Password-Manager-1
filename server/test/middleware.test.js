const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

const {
  COOKIE_NAMES,
  verifyToken,
  verifyCsrfToken,
  issueCsrfToken,
  setSessionCookie,
  setCsrfCookie,
  clearAuthCookies,
  normalizeEmail,
  isWeakPassword,
} = require('../middleware.js');

const SECRET = 'unit-test-secret';
process.env.JWT_SECRET = SECRET;
process.env.CSRF_SECRET = SECRET;
process.env.COOKIE_SECURE = 'false';

function makeRes() {
  const res = {
    cookies: [],
    _status: 200,
    _json: null,
    status(code) { this._status = code; return this; },
    json(body) { this._json = body; return this; },
    cookie(name, value, options) { this.cookies.push({ name, value, options }); return this; },
  };
  return res;
}

function makeReq(overrides = {}) {
  return {
    cookies: {},
    headers: {},
    ...overrides,
  };
}

let req, res;
beforeEach(() => {
  req = makeReq();
  res = makeRes();
});

// ---------------------------------------------------------------- JWT ------

test('verifyToken rejects a request with no session cookie', () => {
  let nextCalled = false;
  const next = () => { nextCalled = true; };
  const returned = verifyToken(req, res, next);
  assert.equal(res._status, 400);
  assert.equal(returned._json.error, 'Unauthorised');
  assert.equal(nextCalled, false);
});

test('verifyToken accepts a valid JWT and sets req.user_id', () => {
  const token = jwt.sign({ user_id: 42 }, SECRET);
  req.cookies[COOKIE_NAMES.session] = token;
  let nextCalled = false;
  verifyToken(req, res, () => { nextCalled = true; });
  assert.equal(req.user_id, 42);
  assert.equal(nextCalled, true);
});

test('verifyToken rejects a token signed with the wrong secret', () => {
  req.cookies[COOKIE_NAMES.session] = jwt.sign({ user_id: 42 }, 'other-secret');
  verifyToken(req, res, () => assert.fail('should not call next'));
  assert.equal(res._status, 400);
});

test('verifyToken rejects an expired token', () => {
  const token = jwt.sign({ user_id: 42 }, SECRET, { expiresIn: '-10s' });
  req.cookies[COOKIE_NAMES.session] = token;
  verifyToken(req, res, () => assert.fail('should not call next'));
  assert.equal(res._status, 400);
});

// ---------------------------------------------------------------- CSRF -----

test('verifyCsrfToken passes when the header matches a valid signed cookie', () => {
  const token = issueCsrfToken();
  req.cookies[COOKIE_NAMES.csrf] = token;
  req.headers['x-csrf-token'] = token;
  let nextCalled = false;
  verifyCsrfToken(req, res, () => { nextCalled = true; });
  assert.equal(nextCalled, true);
});

test('verifyCsrfToken rejects when the header is missing (true double-submit)', () => {
  req.cookies[COOKIE_NAMES.csrf] = issueCsrfToken();
  verifyCsrfToken(req, res, () => assert.fail('should not call next'));
  assert.equal(res._status, 403);
});

test('verifyCsrfToken rejects when the header does not match the cookie', () => {
  req.cookies[COOKIE_NAMES.csrf] = issueCsrfToken();
  req.headers['x-csrf-token'] = 'attacker-guessed-value';
  verifyCsrfToken(req, res, () => assert.fail('should not call next'));
  assert.equal(res._status, 403);
});

test('verifyCsrfToken rejects a cookie signed with a different secret', () => {
  const forged = issueCsrfToken(); // issued under the real secret
  req.cookies[COOKIE_NAMES.csrf] = forged;
  // header equals cookie, but the stored secret changes -> signature fails
  req.headers['x-csrf-token'] = forged;
  process.env.CSRF_SECRET = 'rotated-secret';
  try {
    verifyCsrfToken(req, res, () => assert.fail('should not call next'));
    assert.equal(res._status, 403);
  } finally {
    process.env.CSRF_SECRET = SECRET;
  }
});

// ------------------------------------------------------------- cookies -----

test('session cookie is httpOnly; csrf cookie must be readable by JS', () => {
  setSessionCookie(res, 'session-value');
  setCsrfCookie(res, 'csrf-value');
  const session = res.cookies.find((c) => c.name === COOKIE_NAMES.session);
  const csrf = res.cookies.find((c) => c.name === COOKIE_NAMES.csrf);
  assert.equal(session.options.httpOnly, true);
  assert.equal(session.options.sameSite, 'Strict');
  assert.equal(csrf.options.httpOnly, false);
  assert.equal(csrf.options.sameSite, 'Strict');
});

test('clearAuthCookies expires both session and csrf cookies', () => {
  clearAuthCookies(res);
  assert.equal(res.cookies.length, 2);
  for (const cookie of res.cookies) {
    assert.equal(cookie.value, '');
    assert.ok(cookie.options.expires.getTime() <= Date.now());
  }
});

// ----------------------------------------------------------- helpers ------

test('normalizeEmail lower-cases and trims', () => {
  assert.equal(normalizeEmail('  User@Example.COM '), 'user@example.com');
  assert.equal(normalizeEmail(undefined), '');
});

test('isWeakPassword enforces a minimum of 8 characters', () => {
  assert.equal(isWeakPassword('short7!'), true);
  assert.equal(isWeakPassword('1234567'), true);
  assert.equal(isWeakPassword('12345678'), false);
  assert.equal(isWeakPassword(null), true);
});
