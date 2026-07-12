import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    sku: z.string().min(1),
    department: z.string().optional(),
    carbonFootprint: z.number().min(0).optional(),
    recyclablePct: z.number().min(0).max(100).optional(),
    ethicalSourcingScore: z.number().min(0).max(100).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateProductSchema = z.object({
  body: createProductSchema.shape.body.partial().extend({
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
