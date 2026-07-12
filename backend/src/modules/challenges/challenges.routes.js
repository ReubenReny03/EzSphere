import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { upload } from '../../middleware/upload.js';
import { ROLES } from '../../utils/constants.js';
import {
  createChallengeSchema,
  updateChallengeSchema,
  statusSchema,
  idParamSchema,
  progressSchema,
} from './challenges.validation.js';
import * as challengesController from './challenges.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/participation', challengesController.listParticipation);
router.patch(
  '/participation/:id/approve',
  requireRole(ROLES.ADMIN, ROLES.MANAGER),
  validate(idParamSchema),
  challengesController.approveParticipation,
);
router.patch(
  '/participation/:id/reject',
  requireRole(ROLES.ADMIN, ROLES.MANAGER),
  validate(idParamSchema),
  challengesController.rejectParticipation,
);
router.patch(
  '/participation/:id/progress',
  upload.single('proof'),
  validate(progressSchema),
  challengesController.updateProgress,
);

router.get('/', challengesController.list);
router.get('/:id', validate(idParamSchema), challengesController.getById);
router.post(
  '/',
  requireRole(ROLES.ADMIN, ROLES.MANAGER),
  validate(createChallengeSchema),
  challengesController.create,
);
router.patch(
  '/:id',
  requireRole(ROLES.ADMIN, ROLES.MANAGER),
  validate(updateChallengeSchema),
  challengesController.update,
);
router.patch(
  '/:id/status',
  requireRole(ROLES.ADMIN, ROLES.MANAGER),
  validate(statusSchema),
  challengesController.setStatus,
);
router.post('/:id/join', validate(idParamSchema), challengesController.join);

export default router;
