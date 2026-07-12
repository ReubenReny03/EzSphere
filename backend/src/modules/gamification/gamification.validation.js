import { z } from 'zod';

export const leaderboardQuerySchema = z.object({
  body: z.object({}).optional(),
  query: z.object({
    scope: z.enum(['global', 'department']).optional(),
    department: z.string().optional(),
    limit: z.string().optional(),
  }),
  params: z.object({}).optional(),
});

export const redeemParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) }),
});
