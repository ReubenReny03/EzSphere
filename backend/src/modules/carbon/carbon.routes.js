import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { ROLES } from '../../utils/constants.js';
import {
  createTransactionSchema,
  generateTransactionSchema,
  idParamSchema,
  trendQuerySchema,
} from './carbon.validation.js';
import * as carbonController from './carbon.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/trend', validate(trendQuerySchema), carbonController.trend);
router.get('/by-department', carbonController.byDepartment);
router.get('/', carbonController.list);
router.get('/:id', validate(idParamSchema), carbonController.getById);
router.post(
  '/generate',
  requireRole(ROLES.ADMIN, ROLES.MANAGER),
  validate(generateTransactionSchema),
  carbonController.generate,
);
router.post('/', requireRole(ROLES.ADMIN, ROLES.MANAGER), validate(createTransactionSchema), carbonController.create);

export default router;
