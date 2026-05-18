import { Router } from 'express';
import * as ctrl from '../controllers/comments.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// DELETE /api/comments/:id
router.delete('/:id', authMiddleware, ctrl.deleteComment);

export default router;
