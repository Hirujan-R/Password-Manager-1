/**
 * Tiny sliding-window rate limiter (in-memory). Sufficient for a single-instance
 * local app: it prevents brute-forcing the login endpoint and mass account
 * enumeration on registration without any external infrastructure.
 */
class SlidingWindowRateLimiter {
  constructor({ max, windowMs, now = Date.now } = {}) {
    this.max = max;
    this.windowMs = windowMs;
    this.now = now;
    this.hits = new Map(); // key -> [timestamps]
  }

  prune(key) {
    const cutoff = this.now() - this.windowMs;
    const times = (this.hits.get(key) || []).filter((t) => t > cutoff);
    if (times.length === 0) {
      this.hits.delete(key);
    } else {
      this.hits.set(key, times);
    }
    return times;
  }

  /** Returns true if the request is allowed, false if it should be rejected. */
  allow(key) {
    const times = this.prune(key);
    if (times.length >= this.max) {
      return false;
    }
    times.push(this.now());
    this.hits.set(key, times);
    return true;
  }

  /** Guard against unbounded memory growth for never-seen keys again. */
  reset() {
    this.hits.clear();
  }
}

/**
 * Express middleware backing a route. Keys on the client IP plus (optionally)
 * an account field so one user hammering does not lock out everyone behind NAT.
 */
function makeRateLimiter({ max, windowMs, accountField = null, now }) {
  const limiter = new SlidingWindowRateLimiter({ max, windowMs, now });
  return function rateLimit(req, res, next) {
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    const account = accountField ? req.body?.[accountField] : null;
    const key = `${ip}|${String(account || '').toLowerCase()}`;
    if (!limiter.allow(key)) {
      return res.status(429).json({ error: 'Too many attempts. Please try again later.' });
    }
    return next();
  };
}

module.exports = { SlidingWindowRateLimiter, makeRateLimiter };
