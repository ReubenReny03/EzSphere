import { z } from 'zod';
import { ACTIVITY_TYPES } from '../../utils/constants.js';

export const createEmissionFactorSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    activityType: z.enum(ACTIVITY_TYPES),
    unit: z.string().min(1),
    value: z.number().min(0),
    source: z.string().optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateEmissionFactorSchema = z.object({
  body: createEmissionFactorSchema.shape.body.partial().extend({
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
