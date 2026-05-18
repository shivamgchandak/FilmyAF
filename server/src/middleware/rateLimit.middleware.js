import rateLimit from 'express-rate-limit';

export const generateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: (req) => (req.user ? 30 : 5),
  keyGenerator: (req) => (req.user ? `u:${req.user._id}` : `ip:${req.ip}`),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message:
        'Whoa, slow down! The director needs a break. Try again in a bit. 🎬',
    },
  },
});

export const writeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  keyGenerator: (req) => (req.user ? `u:${req.user._id}` : `ip:${req.ip}`),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'TOO_MANY_REQUESTS', message: 'Too many actions, slow down.' },
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'TOO_MANY_REQUESTS', message: 'Too many auth attempts, please wait.' },
  },
});
