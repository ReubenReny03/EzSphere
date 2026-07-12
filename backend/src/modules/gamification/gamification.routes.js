import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/auth.js';
import { leaderboardQuerySchema, redeemParamSchema } from './gamification.validation.js';
import * as gamificationController from './gamification.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/leaderboard', validate(leaderboardQuerySchema), gamificationController.leaderboard);
router.post('/rewards/:id/redeem', validate(redeemParamSchema), gamificationController.redeem);

export default router;
