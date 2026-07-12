import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { ROLES } from '../../utils/constants.js';
import { createGoalSchema, updateGoalSchema, idParamSchema } from './goals.validation.js';
import * as goalsController from './goals.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', goalsController.list);
router.get('/:id', validate(idParamSchema), goalsController.getById);
router.post('/', requireRole(ROLES.ADMIN, ROLES.MANAGER), validate(createGoalSchema), goalsController.create);
router.patch('/:id', requireRole(ROLES.ADMIN, ROLES.MANAGER), validate(updateGoalSchema), goalsController.update);
router.delete('/:id', requireRole(ROLES.ADMIN, ROLES.MANAGER), validate(idParamSchema), goalsController.remove);

export default router;
