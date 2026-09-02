import { Router } from 'express';
import * as ctrl from '../controllers/takes.controller.js';
import { optionalAuth } from '../middleware/optionalAuth.middleware.js';
import { anonSession } from '../middleware/anonSession.middleware.js';

const router = Router();

router.get('/', optionalAuth, anonSession, ctrl.getTakes);

export default router;
