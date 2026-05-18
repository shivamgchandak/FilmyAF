import { body } from 'express-validator';
import { MOODS } from '../models/Script.js';

export const generateValidator = [
  body('situation')
    .isString()
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Situation must be 5-500 characters'),
  body('mood').optional().isIn(MOODS).withMessage('Invalid mood'),
];

export const regenSceneValidator = [
  body('scriptId').isMongoId().withMessage('Invalid scriptId'),
  body('sceneIndex').isInt({ min: 1, max: 5 }).withMessage('sceneIndex must be 1-5'),
  body('instruction').optional().isString().isLength({ max: 300 }),
];

export const regenScriptOnlyValidator = [
  body('scriptId').isMongoId().withMessage('Invalid scriptId'),
];

export const editScriptValidator = [
  body('scriptId').isMongoId().withMessage('Invalid scriptId'),
  body('situation').isString().trim().isLength({ min: 5, max: 500 })
    .withMessage('Situation must be 5-500 characters'),
  body('mood').optional().isIn(MOODS).withMessage('Invalid mood'),
];
