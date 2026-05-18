import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';

const themedMessages = {
  500: 'Our screenwriter has gone for a chai break ☕ — please try again.',
  503: 'The director is shouting "cut!" — try again in a moment.',
};

export const errorMiddleware = (err, req, res, _next) => {
  if (err && err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      error: { code: 'DUPLICATE', message: `${field} already exists`, field },
    });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const details = {};
    for (const [k, v] of Object.entries(err.errors)) details[k] = v.message;
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION', message: 'Validation failed', details },
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      error: { code: 'BAD_ID', message: `Invalid ${err.path}` },
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.status).json({
      success: false,
      error: { code: err.code, message: err.message, details: err.details },
    });
  }

  console.error('[error.middleware]', err);
  const status = err.status || 500;
  return res.status(status).json({
    success: false,
    error: {
      code: 'INTERNAL',
      message: themedMessages[status] || err.message || 'Something broke',
    },
  });
};
