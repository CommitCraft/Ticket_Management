import { z } from 'zod';

export const departmentSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  slaHoursByPriority: z
    .object({
      low: z.number().positive().optional(),
      medium: z.number().positive().optional(),
      high: z.number().positive().optional(),
      urgent: z.number().positive().optional()
    })
    .optional()
});
