import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { ROLES } from '../../utils/constants.js';
import { createAuditSchema, updateAuditSchema, idParamSchema } from './audits.validation.js';
import * as auditsController from './audits.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', auditsController.list);
router.get('/:id', validate(idParamSchema), auditsController.getById);
router.post('/', requireRole(ROLES.ADMIN, ROLES.MANAGER), validate(createAuditSchema), auditsController.create);
router.patch('/:id', requireRole(ROLES.ADMIN, ROLES.MANAGER), validate(updateAuditSchema), auditsController.update);
router.delete('/:id', requireRole(ROLES.ADMIN), validate(idParamSchema), auditsController.remove);

export default router;
