import { z } from 'zod';

export const updateSettingsSchema = z.object({
  body: z.object({
    esgWeights: z
      .object({
        environmental: z.number().min(0).max(1).optional(),
        social: z.number().min(0).max(1).optional(),
        governance: z.number().min(0).max(1).optional(),
      })
      .optional(),
    flags: z
      .object({
        autoEmissionCalc: z.boolean().optional(),
        evidenceRequired: z.boolean().optional(),
        autoAwardBadges: z.boolean().optional(),
        emailAlerts: z.boolean().optional(),
        notifyNewCompliance: z.boolean().optional(),
        notifyApproval: z.boolean().optional(),
        notifyPolicyReminder: z.boolean().optional(),
        notifyBadgeUnlock: z.boolean().optional(),
      })
      .optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
