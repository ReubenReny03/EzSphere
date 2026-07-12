import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { ROLES } from '../../utils/constants.js';
import { createIssueSchema, updateIssueSchema, idParamSchema, listQuerySchema } from './compliance.validation.js';
import * as complianceController from './compliance.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', validate(listQuerySchema), complianceController.list);
router.get('/:id', validate(idParamSchema), complianceController.getById);
router.post('/', requireRole(ROLES.ADMIN, ROLES.MANAGER), validate(createIssueSchema), complianceController.create);
router.patch(
  '/:id',
  requireRole(ROLES.ADMIN, ROLES.MANAGER),
  validate(updateIssueSchema),
  complianceController.update,
);
router.delete('/:id', requireRole(ROLES.ADMIN), validate(idParamSchema), complianceController.remove);

export default router;
