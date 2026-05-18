import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { signToken } from '../utils/jwt.js';

const tokenFor = (user) => signToken({ sub: user._id.toString() });

export const signup = async ({ firstName, lastName, email, password, username }) => {
  const cleanUsername = (username || '').trim().toLowerCase();

  const [existingEmail, existingUsername] = await Promise.all([
    User.findOne({ email }).select('_id'),
    User.findOne({ username: cleanUsername }).select('_id'),
  ]);
  if (existingEmail) {
    throw new ApiError(409, 'CONFLICT', 'Email already registered', {
      email: 'Email already registered',
    });
  }
  if (existingUsername) {
    throw new ApiError(409, 'CONFLICT', 'Username already taken', {
      username: 'Username already taken',
    });
  }

  try {
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      username: cleanUsername,
    });
    return { user, token: tokenFor(user) };
  } catch (err) {
    if (err && err.code === 11000) {
      const field = Object.keys(err.keyValue || {})[0] || 'field';
      throw new ApiError(409, 'CONFLICT', `${field} already taken`, {
        [field]: `${field} already taken`,
      });
    }
    throw err;
  }
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw ApiError.unauthorized('Invalid credentials');
  const ok = await user.comparePassword(password);
  if (!ok) throw ApiError.unauthorized('Invalid credentials');
  user.password = undefined;
  return { user, token: tokenFor(user) };
};
