import { z } from 'zod';
import { COMPLIANCE_SEVERITIES, POLICY_CATEGORIES } from '../../utils/constants.js';

const REPORT_TYPES = ['environmental', 'social', 'governance', 'esg-summary'];
const EXPORT_FORMATS = ['csv', 'excel', 'pdf'];
const MODULES = ['environmental', 'social', 'governance', 'gamification'];

export const cannedReportQuerySchema = z.object({
  body: z.object({}).optional(),
  query: z.object({
    department: z.string().optional(),
    months: z.coerce.number().min(1).max(36).optional(),
  }),
  params: z.object({}).optional(),
});

export const customReportSchema = z.object({
  body: z.object({
    module: z.enum(MODULES),
    department: z.string().optional(),
    employee: z.string().optional(),
    challenge: z.string().optional(),
    esgCategory: z.enum(POLICY_CATEGORIES).optional(),
    severity: z.enum(COMPLIANCE_SEVERITIES).optional(),
    dateRange: z
      .object({
        from: z.coerce.date().optional(),
        to: z.coerce.date().optional(),
      })
      .optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const exportCannedSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({
    format: z.enum(EXPORT_FORMATS),
    department: z.string().optional(),
    months: z.coerce.number().min(1).max(36).optional(),
  }),
  params: z.object({ type: z.enum(REPORT_TYPES) }),
});

export const exportCustomSchema = z.object({
  body: customReportSchema.shape.body,
  query: z.object({ format: z.enum(EXPORT_FORMATS) }),
  params: z.object({}).optional(),
});
