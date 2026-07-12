import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { ROLES } from '../../utils/constants.js';
import { createProductSchema, updateProductSchema, idParamSchema } from './products.validation.js';
import * as productsController from './products.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', productsController.list);
router.get('/:id', validate(idParamSchema), productsController.getById);
router.post('/', requireRole(ROLES.ADMIN, ROLES.MANAGER), validate(createProductSchema), productsController.create);
router.patch('/:id', requireRole(ROLES.ADMIN, ROLES.MANAGER), validate(updateProductSchema), productsController.update);
router.delete('/:id', requireRole(ROLES.ADMIN), validate(idParamSchema), productsController.remove);

export default router;
