import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { ROLES } from '../../utils/constants.js';
import {
  createEmissionFactorSchema,
  updateEmissionFactorSchema,
  idParamSchema,
} from './emissionFactors.validation.js';
import * as emissionFactorsController from './emissionFactors.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', emissionFactorsController.list);
router.get('/:id', validate(idParamSchema), emissionFactorsController.getById);
router.post(
  '/',
  requireRole(ROLES.ADMIN, ROLES.MANAGER),
  validate(createEmissionFactorSchema),
  emissionFactorsController.create,
);
router.patch(
  '/:id',
  requireRole(ROLES.ADMIN, ROLES.MANAGER),
  validate(updateEmissionFactorSchema),
  emissionFactorsController.update,
);
router.delete('/:id', requireRole(ROLES.ADMIN), validate(idParamSchema), emissionFactorsController.remove);

export default router;
