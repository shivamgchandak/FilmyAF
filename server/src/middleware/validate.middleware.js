import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';

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
