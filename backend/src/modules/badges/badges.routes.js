import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { ROLES } from '../../utils/constants.js';
import { createBadgeSchema, updateBadgeSchema, idParamSchema } from './badges.validation.js';
import * as badgesController from './badges.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', badgesController.list);
router.get('/:id', validate(idParamSchema), badgesController.getById);
router.post('/', requireRole(ROLES.ADMIN), validate(createBadgeSchema), badgesController.create);
router.patch('/:id', requireRole(ROLES.ADMIN), validate(updateBadgeSchema), badgesController.update);
router.delete('/:id', requireRole(ROLES.ADMIN), validate(idParamSchema), badgesController.remove);

export default router;
