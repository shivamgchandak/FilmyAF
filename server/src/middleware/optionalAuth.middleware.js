import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/User.js';

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
  }
  return next();
};
