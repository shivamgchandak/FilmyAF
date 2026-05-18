import { Router } from 'express';
import * as ctrl from '../controllers/auth.controller.js';
import { signupValidator, loginValidator } from '../validators/auth.validator.js';
import { validate } from '../middleware/validate.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.post('/signup', authLimiter, signupValidator, validate, ctrl.signup);
router.post('/login', authLimiter, loginValidator, validate, ctrl.login);
router.get('/me', authMiddleware, ctrl.me);

export default router;
