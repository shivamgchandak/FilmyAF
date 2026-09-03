import { Router } from 'express';
import * as ctrl from '../controllers/suggestions.controller.js';

const router = Router();

router.get('/daily', ctrl.daily);

export default router;
