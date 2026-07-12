import { z } from 'zod';

export const createRewardSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    pointsRequired: z.number().min(0),
    stock: z.number().min(0),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateRewardSchema = z.object({
  body: createRewardSchema.shape.body.partial().extend({
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
