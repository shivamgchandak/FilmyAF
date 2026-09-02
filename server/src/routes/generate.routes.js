import { Router } from 'express';
import * as ctrl from '../controllers/generate.controller.js';
import {
  generateValidator,
  regenSceneValidator,
  regenScriptOnlyValidator,
  editScriptValidator,
} from '../validators/generate.validator.js';
import { validate } from '../middleware/validate.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { optionalAuth } from '../middleware/optionalAuth.middleware.js';
import { generateLimiter } from '../middleware/rateLimit.middleware.js';
import { anonSession } from '../middleware/anonSession.middleware.js';

const router = Router();

router.post(
  '/script',
  optionalAuth,
  anonSession,
  generateLimiter,
  generateValidator,
  validate,
  ctrl.generateScript
);

router.post(
  '/regenerate-scene',
  authMiddleware,
  generateLimiter,
  regenSceneValidator,
  validate,
  ctrl.regenerateScene
);

router.post(
  '/regenerate-title',
  authMiddleware,
  generateLimiter,
  regenScriptOnlyValidator,
  validate,
  ctrl.regenerateTitle
);

router.post(
  '/regenerate-characters',
  authMiddleware,
  generateLimiter,
  regenScriptOnlyValidator,
  validate,
  ctrl.regenerateCharacters
);

router.post(
  '/edit-script',
  authMiddleware,
  generateLimiter,
  editScriptValidator,
  validate,
  ctrl.editScript
);

export default router;
