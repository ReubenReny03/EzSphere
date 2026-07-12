import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/auth.js';
import {
  cannedReportQuerySchema,
  customReportSchema,
  exportCannedSchema,
  exportCustomSchema,
} from './reports.validation.js';
import * as reportsController from './reports.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/environmental', validate(cannedReportQuerySchema), reportsController.environmental);
router.get('/social', validate(cannedReportQuerySchema), reportsController.social);
router.get('/governance', validate(cannedReportQuerySchema), reportsController.governance);
router.get('/esg-summary', reportsController.esgSummary);
router.post('/custom', validate(customReportSchema), reportsController.custom);
router.get('/export/:type', validate(exportCannedSchema), reportsController.exportCanned);
router.post('/custom/export', validate(exportCustomSchema), reportsController.exportCustom);

export default router;
