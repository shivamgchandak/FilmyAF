import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/User.js';

/**
 * Loads req.user if a valid token is present, otherwise lets the request through
 * anonymously. Used by endpoints like POST /generate/script where anon users
 * are allowed but logged-in users get extra perks (rate limit, history).
 */
export const optionalAuth = async (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return next();
  const token = header.slice(7).trim();
  if (!token) return next();

  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.sub);
    if (user) req.user = user;
  } catch {
    // ignore — anonymous
  }
  return next();
};
