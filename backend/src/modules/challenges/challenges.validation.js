import { z } from 'zod';
import { CHALLENGE_DIFFICULTIES, CHALLENGE_STATUSES } from '../../utils/constants.js';

export const createChallengeSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    category: z.string().min(1),
    description: z.string().optional(),
    xp: z.number().min(0).optional(),
    difficulty: z.enum(CHALLENGE_DIFFICULTIES),
    evidenceRequired: z.boolean().optional(),
    deadline: z.coerce.date(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateChallengeSchema = z.object({
  body: createChallengeSchema.shape.body.partial(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) }),
});

export const statusSchema = z.object({
  body: z.object({ status: z.enum(CHALLENGE_STATUSES) }),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) }),
});

export const idParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) }),
});

export const progressSchema = z.object({
  body: z.object({ progress: z.number().min(0).max(100).optional() }),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) }),
});
