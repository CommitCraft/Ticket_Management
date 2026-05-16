import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  FRONTEND_URL: z.string().url(),
  SUPER_ADMIN_NAME: z.string().default('System Super Admin'),
  SUPER_ADMIN_EMAIL: z.string().email().default('admin@helpdesk.local'),
  SUPER_ADMIN_PASSWORD: z.string().min(8).default('Admin@12345'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  WHATSAPP_API_URL: z.string().url().optional(),
  WHATSAPP_ID_INSTANCE: z.string().optional(),
  WHATSAPP_API_TOKEN_INSTANCE: z.string().optional(),
  WHATSAPP_GROUP_ID: z.string().optional(),
  HOST: z.string().default('0.0.0.0'),
  ALLOW_ALL_ORIGINS: z.coerce.boolean().optional().default(false),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development')
});

export const env = envSchema.parse(process.env);

