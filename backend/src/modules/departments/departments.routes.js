import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { ROLES } from '../../utils/constants.js';
import { createDepartmentSchema, updateDepartmentSchema, idParamSchema } from './departments.validation.js';
import * as departmentsController from './departments.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', departmentsController.list);
router.get('/:id', validate(idParamSchema), departmentsController.getById);
router.post('/', requireRole(ROLES.ADMIN), validate(createDepartmentSchema), departmentsController.create);
router.patch('/:id', requireRole(ROLES.ADMIN), validate(updateDepartmentSchema), departmentsController.update);
router.delete('/:id', requireRole(ROLES.ADMIN), validate(idParamSchema), departmentsController.remove);

export default router;
