import { body } from 'express-validator';
import { MOODS } from '../models/Script.js';

export const saveScriptValidator = [
  body('title').isString().trim().isLength({ min: 1, max: 200 }),
  body('tagline').optional().isString().trim().isLength({ max: 300 }),
  body('situation').isString().trim().isLength({ min: 1, max: 500 }),
  body('mood').optional().isIn(MOODS),
  body('characters').isArray({ min: 1 }),
  body('scenes').isArray({ min: 1 }),
];

export const updateScriptValidator = [
  body('title').optional().isString().trim().isLength({ min: 1, max: 200 }),
  body('tagline').optional().isString().trim().isLength({ max: 300 }),
  body('isPublic').optional().isBoolean(),
];
