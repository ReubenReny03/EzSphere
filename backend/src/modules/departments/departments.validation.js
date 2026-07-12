import { z } from 'zod';

export const createDepartmentSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    code: z.string().min(1),
    head: z.string().optional(),
    parentDepartment: z.string().optional(),
    diversityScore: z.number().min(0).max(100).optional(),
    emissionBudget: z.number().min(0).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateDepartmentSchema = z.object({
  body: createDepartmentSchema.shape.body.partial().extend({
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
