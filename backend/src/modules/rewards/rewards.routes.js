import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { ROLES } from '../../utils/constants.js';
import { createRewardSchema, updateRewardSchema, idParamSchema } from './rewards.validation.js';
import * as rewardsController from './rewards.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', rewardsController.list);
router.get('/:id', validate(idParamSchema), rewardsController.getById);
router.post('/', requireRole(ROLES.ADMIN), validate(createRewardSchema), rewardsController.create);
router.patch('/:id', requireRole(ROLES.ADMIN), validate(updateRewardSchema), rewardsController.update);
router.delete('/:id', requireRole(ROLES.ADMIN), validate(idParamSchema), rewardsController.remove);

export default router;
