import { z } from 'zod';
import { POLICY_CATEGORIES } from '../../utils/constants.js';

export const createPolicySchema = z.object({
  body: z.object({
    title: z.string().min(1),
    category: z.enum(POLICY_CATEGORIES),
    description: z.string().optional(),
    version: z.string().optional(),
    effectiveDate: z.coerce.date(),
    requiresAcknowledgement: z.boolean().optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updatePolicySchema = z.object({
  body: createPolicySchema.shape.body.partial().extend({
    status: z.enum(['active', 'inactive']).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) }),
});

export const idParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) }),
});
