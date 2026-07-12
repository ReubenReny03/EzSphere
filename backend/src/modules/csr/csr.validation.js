import { z } from 'zod';
import { APPROVAL_STATUSES } from '../../utils/constants.js';

export const createActivitySchema = z.object({
  body: z.object({
    title: z.string().min(1),
    category: z.string().min(1),
    description: z.string().optional(),
    evidenceRequired: z.boolean().optional(),
    date: z.coerce.date(),
    capacity: z.number().min(0).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateActivitySchema = z.object({
  body: createActivitySchema.shape.body.partial().extend({
    status: z.enum(['Open', 'Closed']).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) }),
});

export const idParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) }),
});

export const reviewParticipationSchema = z.object({
  body: z.object({
    decision: z.enum([APPROVAL_STATUSES[1], APPROVAL_STATUSES[2]]), // Approved | Rejected
  }),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) }),
});

export const queueQuerySchema = z.object({
  body: z.object({}).optional(),
  query: z.object({ status: z.enum(APPROVAL_STATUSES).optional() }),
  params: z.object({}).optional(),
});
