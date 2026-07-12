import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { ROLES } from '../../utils/constants.js';
import * as scoringController from './scoring.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/overview', scoringController.overview);
router.get('/departments', scoringController.departments);
router.post('/recompute', requireRole(ROLES.ADMIN, ROLES.MANAGER), scoringController.recompute);

export default router;
