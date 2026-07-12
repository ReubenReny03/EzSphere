import { z } from 'zod';
import { BADGE_METRICS } from '../../utils/constants.js';

export const createBadgeSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    icon: z.string().optional(),
    unlockRule: z.object({
      metric: z.enum(BADGE_METRICS),
      threshold: z.number().min(0),
    }),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateBadgeSchema = z.object({
  body: createBadgeSchema.shape.body.partial().extend({
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
