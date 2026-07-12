import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { upload } from '../../middleware/upload.js';
import { ROLES } from '../../utils/constants.js';
import { createActivitySchema, updateActivitySchema, idParamSchema, queueQuerySchema } from './csr.validation.js';
import * as csrController from './csr.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/participation/queue', validate(queueQuerySchema), csrController.queue);
router.patch(
  '/participation/:id/approve',
  requireRole(ROLES.ADMIN, ROLES.MANAGER),
  validate(idParamSchema),
  csrController.approve,
);
router.patch(
  '/participation/:id/reject',
  requireRole(ROLES.ADMIN, ROLES.MANAGER),
  validate(idParamSchema),
  csrController.reject,
);

router.get('/', csrController.listActivities);
router.get('/:id', validate(idParamSchema), csrController.getActivityById);
router.post('/', requireRole(ROLES.ADMIN, ROLES.MANAGER), validate(createActivitySchema), csrController.createActivity);
router.patch(
  '/:id',
  requireRole(ROLES.ADMIN, ROLES.MANAGER),
  validate(updateActivitySchema),
  csrController.updateActivity,
);
router.delete('/:id', requireRole(ROLES.ADMIN, ROLES.MANAGER), validate(idParamSchema), csrController.removeActivity);
router.post('/:id/join', upload.single('proof'), validate(idParamSchema), csrController.join);

export default router;
