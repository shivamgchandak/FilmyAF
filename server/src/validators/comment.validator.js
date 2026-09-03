import { body } from 'express-validator';

export const createCommentValidator = [
  body('content').isString().trim().isLength({ min: 1, max: 500 }),
  /* `values: 'null'` matters. In express-validator 7 a bare .optional() skips
     ONLY undefined, so an explicit `"parentId": null` in the body still gets
     run through isMongoId() and fails with "Invalid value" - which is exactly
     what a top-level comment sends. null means "not a reply" and is valid. */
  body('parentId').optional({ values: 'null' }).isMongoId(),
];
