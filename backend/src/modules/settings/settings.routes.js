import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { ROLES } from '../../utils/constants.js';
import { updateSettingsSchema } from './settings.validation.js';
import * as settingsController from './settings.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', settingsController.getSettings);
router.patch('/', requireRole(ROLES.ADMIN), validate(updateSettingsSchema), settingsController.updateSettings);

export default router;
