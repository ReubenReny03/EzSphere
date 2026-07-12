import { z } from 'zod';
import { AUDIT_STATUSES } from '../../utils/constants.js';

export const createAuditSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    department: z.string().min(1),
    auditor: z.string().optional(),
    date: z.coerce.date(),
    findingsCount: z.number().min(0).optional(),
    findings: z.string().optional(),
    status: z.enum(AUDIT_STATUSES).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateAuditSchema = z.object({
  body: createAuditSchema.shape.body.partial(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) }),
});

export const idParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) }),
});
