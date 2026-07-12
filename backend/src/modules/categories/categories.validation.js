import { z } from 'zod';
import { CATEGORY_TYPES } from '../../utils/constants.js';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1),
    type: z.enum(CATEGORY_TYPES),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateCategorySchema = z.object({
  body: createCategorySchema.shape.body.partial().extend({
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
