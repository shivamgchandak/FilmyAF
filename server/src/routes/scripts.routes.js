import { Router } from 'express';
import * as ctrl from '../controllers/scripts.controller.js';
import * as likeCtrl from '../controllers/likes.controller.js';
import * as commentCtrl from '../controllers/comments.controller.js';
import {
  saveScriptValidator,
  updateScriptValidator,
} from '../validators/script.validator.js';
import { createCommentValidator } from '../validators/comment.validator.js';
import { validate } from '../middleware/validate.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { optionalAuth } from '../middleware/optionalAuth.middleware.js';
import { writeLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.get('/share/:slug', optionalAuth, ctrl.getBySlug);

router.get('/my/history', authMiddleware, ctrl.myHistory);
router.get('/user/:username', ctrl.byUsername);

router.post('/:id/like', authMiddleware, writeLimiter, likeCtrl.toggleLike);
router.get('/:id/likes', optionalAuth, likeCtrl.getLikes);

router.get('/:id/comments', commentCtrl.listComments);
router.post(
  '/:id/comments',
  authMiddleware,
  writeLimiter,
  createCommentValidator,
  validate,
  commentCtrl.addComment
);

router.get('/:id', optionalAuth, ctrl.getById);
router.post('/', authMiddleware, saveScriptValidator, validate, ctrl.createOne);
router.patch('/:id', authMiddleware, updateScriptValidator, validate, ctrl.updateOne);
router.delete('/:id', authMiddleware, ctrl.deleteOne);

router.post('/:id/clone', authMiddleware, writeLimiter, ctrl.cloneOne);

export default router;
