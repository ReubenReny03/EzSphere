import { z } from 'zod';
import { GOAL_METRICS, GOAL_STATUSES } from '../../utils/constants.js';

export const createGoalSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    department: z.string().min(1),
    metric: z.enum(GOAL_METRICS),
    targetValue: z.number().min(0),
    currentValue: z.number().min(0).optional(),
    unit: z.string().optional(),
    deadline: z.coerce.date(),
    status: z.enum(GOAL_STATUSES).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateGoalSchema = z.object({
  body: createGoalSchema.shape.body.partial(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) }),
});

export const idParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) }),
});
