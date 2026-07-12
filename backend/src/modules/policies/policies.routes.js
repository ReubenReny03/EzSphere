import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { ROLES } from '../../utils/constants.js';
import { createPolicySchema, updatePolicySchema, idParamSchema } from './policies.validation.js';
import * as policiesController from './policies.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/acknowledgements', policiesController.listAcknowledgements);
router.get('/', policiesController.list);
router.get('/:id', validate(idParamSchema), policiesController.getById);
router.post('/', requireRole(ROLES.ADMIN, ROLES.MANAGER), validate(createPolicySchema), policiesController.create);
router.patch('/:id', requireRole(ROLES.ADMIN, ROLES.MANAGER), validate(updatePolicySchema), policiesController.update);
router.delete('/:id', requireRole(ROLES.ADMIN), validate(idParamSchema), policiesController.remove);
router.post('/:id/acknowledge', validate(idParamSchema), policiesController.acknowledge);

export default router;
