const { test } = require('node:test');
const assert = require('node:assert/strict');
const { SlidingWindowRateLimiter, makeRateLimiter } = require('../rateLimiter.js');

function controllableClock() {
  let t = 0;
  return {
    now: () => t,
    advance(ms) { t += ms; },
  };
}

function makeRes() {
  const res = {
    _status: 200,
    _json: null,
    status(code) { this._status = code; return this; },
    json(body) { this._json = body; return this; },
  };
  return res;
}

test('allows requests up to the limit within the window', () => {
  const limiter = new SlidingWindowRateLimiter({ max: 3, windowMs: 1000, now: Date.now });
  assert.equal(limiter.allow('a'), true);
  assert.equal(limiter.allow('a'), true);
  assert.equal(limiter.allow('a'), true);
  assert.equal(limiter.allow('a'), false, '4th request in the window is blocked');
});

test('allows new requests once the window has elapsed', () => {
  const clock = controllableClock();
  const limiter = new SlidingWindowRateLimiter({ max: 2, windowMs: 1000, now: clock.now });
  limiter.allow('ip|a@b.com');
  limiter.allow('ip|a@b.com');
  assert.equal(limiter.allow('ip|a@b.com'), false);
  clock.advance(1001);
  assert.equal(limiter.allow('ip|a@b.com'), true, 'old hits expired');
});

test('rate limiter middleware returns 429 once the limit is exceeded', () => {
  const clock = controllableClock();
  const middleware = makeRateLimiter({ max: 2, windowMs: 1000, now: clock.now, accountField: 'email' });

  const ok = (req) => {
    const res = makeRes();
    middleware(req, res, () => { res._next = true; });
    return res;
  };
  const base = { ip: '1.2.3.4', socket: { remoteAddress: '1.2.3.4' } };

  assert.equal(ok({ ...base, body: { email: 'a@b.com' } })._next, true);
  assert.equal(ok({ ...base, body: { email: 'a@b.com' } })._next, true);
  const blocked = ok({ ...base, body: { email: 'a@b.com' } });
  assert.equal(blocked._status, 429);
});

test('different accounts are limited independently', () => {
  const clock = controllableClock();
  const limiter = new SlidingWindowRateLimiter({ max: 1, windowMs: 1000, now: clock.now });
  assert.equal(limiter.allow('ip|a@b.com'), true);
  assert.equal(limiter.allow('ip|a@b.com'), false);
  assert.equal(limiter.allow('ip|c@d.com'), true, 'another account is not blocked');
});
