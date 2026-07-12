import { z } from 'zod';
import { COMPLIANCE_SEVERITIES, COMPLIANCE_STATUSES } from '../../utils/constants.js';

export const createIssueSchema = z.object({
  body: z.object({
    audit: z.string().optional(),
    title: z.string().min(1),
    description: z.string().optional(),
    severity: z.enum(COMPLIANCE_SEVERITIES),
    owner: z.string().min(1),
    dueDate: z.coerce.date(),
    department: z.string().optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateIssueSchema = z.object({
  body: createIssueSchema.shape.body.partial().extend({
    status: z.enum(COMPLIANCE_STATUSES).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) }),
});

export const idParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) }),
});

export const listQuerySchema = z.object({
  body: z.object({}).optional(),
  query: z.object({
    overdue: z.enum(['true', 'false']).optional(),
    status: z.enum(COMPLIANCE_STATUSES).optional(),
    severity: z.enum(COMPLIANCE_SEVERITIES).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
  params: z.object({}).optional(),
});
