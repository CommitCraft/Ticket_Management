import { z } from 'zod';

export const createUserSchema = z.object({
  fullName: z.string().min(2, 'Full name is required').max(100),
  companyName: z.string().max(100).optional().default(''),
  phoneNumber: z.string().regex(/^[0-9]{7,20}$|^$/, 'Phone must be 7-20 digits').optional().default(''),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  roleKey: z.enum(['user', 'support_agent', 'admin', 'super_admin']).optional().default('user'),
  departmentId: z.string().optional()
});
