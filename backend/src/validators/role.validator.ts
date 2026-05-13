import { z } from 'zod';

export const roleSchema = z.object({
  key: z.string().min(2),
  name: z.string().min(2),
  description: z.string().optional(),
  permissions: z.array(z.string()).default([]),
  isSystem: z.boolean().optional()
});

export const permissionSchema = z.object({
  key: z.string().min(2),
  name: z.string().min(2),
  description: z.string().optional(),
  module: z.string().min(2)
});
