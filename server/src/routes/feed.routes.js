import { Router } from 'express';
import * as ctrl from '../controllers/feed.controller.js';

const router = Router();

router.get('/popular', ctrl.popular);
router.get('/recent', ctrl.recent);
router.get('/most-cloned', ctrl.mostCloned);

export default router;
