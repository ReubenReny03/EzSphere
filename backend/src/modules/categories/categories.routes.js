import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { ROLES } from '../../utils/constants.js';
import { createCategorySchema, updateCategorySchema, idParamSchema } from './categories.validation.js';
import * as categoriesController from './categories.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', categoriesController.list);
router.get('/:id', validate(idParamSchema), categoriesController.getById);
router.post('/', requireRole(ROLES.ADMIN, ROLES.MANAGER), validate(createCategorySchema), categoriesController.create);
router.patch('/:id', requireRole(ROLES.ADMIN, ROLES.MANAGER), validate(updateCategorySchema), categoriesController.update);
router.delete('/:id', requireRole(ROLES.ADMIN), validate(idParamSchema), categoriesController.remove);

export default router;
