import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';

/**
 * Runs after express-validator chains. Converts errors into a
 * { field: message } map and throws a 400 ApiError.
 */
export const validate = (req, _res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const details = {};
  for (const e of result.array()) {
    const key = e.path || e.param || 'unknown';
    if (!details[key]) details[key] = e.msg;
  }
  return next(ApiError.badRequest('Validation failed', details));
};
