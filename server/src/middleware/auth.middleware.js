import { verifyToken } from '../utils/jwt.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/User.js';

const extractToken = (req) => {
  const header = req.headers.authorization;
  if (!header) return null;
  if (!header.startsWith('Bearer ')) return null;
  return header.slice(7).trim() || null;
};

export const authMiddleware = async (req, _res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return next(ApiError.unauthorized('Missing auth token'));

    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      return next(ApiError.unauthorized('Invalid or expired token'));
    }

    const user = await User.findById(payload.sub);
    if (!user) return next(ApiError.unauthorized('User no longer exists'));

    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
};
