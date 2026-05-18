import { body } from 'express-validator';

export const createCommentValidator = [
  body('content').isString().trim().isLength({ min: 1, max: 500 }),
  body('parentId').optional().isMongoId(),
];
