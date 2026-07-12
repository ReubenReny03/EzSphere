import { z } from 'zod';
import { ACTIVITY_TYPES } from '../../utils/constants.js';

export const createTransactionSchema = z.object({
  body: z.object({
    department: z.string().min(1),
    sourceType: z.enum(ACTIVITY_TYPES),
    sourceRef: z.string().optional(),
    activityData: z.number().min(0),
    emissionFactor: z.string().min(1),
    date: z.coerce.date().optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const generateTransactionSchema = createTransactionSchema;

export const idParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) }),
});

export const trendQuerySchema = z.object({
  body: z.object({}).optional(),
  query: z.object({ months: z.coerce.number().min(1).max(36).optional() }),
  params: z.object({}).optional(),
});
