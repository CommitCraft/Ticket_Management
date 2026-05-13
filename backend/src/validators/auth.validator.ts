import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2),
  companyName: z.string().min(2),
  phoneNumber: z.string().regex(/^[0-9]{7,20}$/, 'Phone must be 7-20 digits only'),
  email: z.string().email(),
  password: z.string().min(8),
  departmentId: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8)
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8)
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  email: z.string().email().optional()
}).refine((value) => Boolean(value.fullName || value.email), {
  message: 'At least one profile field is required'
});
