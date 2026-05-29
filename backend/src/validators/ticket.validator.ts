import { z } from 'zod';
import { TICKET_PRIORITIES, TICKET_STATUSES } from '../constants/ticket.js';

export const createTicketSchema = z.object({
  lineOrStation: z.string().min(2),
  ip: z.string().regex(/^(\d{1,3}\.){3}\d{1,3}$/, 'Enter a valid IP address'),
  currentOperatorPhoneNumber: z.string().regex(/^[0-9]{7,20}$/, 'Phone must be 7-20 digits only'),
  subject: z.string().min(3),
  description: z.string().min(10),
  category: z.string().min(2),
  departmentId: z.string().min(1),
  priority: z.enum(TICKET_PRIORITIES),
  tags: z.array(z.string()).optional(),
  assignedAgentId: z.string().optional()
});

export const updateTicketSchema = z.object({
  lineOrStation: z.string().min(2).optional(),
  ip: z.string().regex(/^(\d{1,3}\.){3}\d{1,3}$/, 'Enter a valid IP address').optional(),
  currentOperatorPhoneNumber: z.string().regex(/^[0-9]{7,20}$/, 'Phone must be 7-20 digits only').optional(),
  subject: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  category: z.string().min(2).optional(),
  departmentId: z.string().min(1).optional(),
  priority: z.enum(TICKET_PRIORITIES).optional(),
  status: z.enum(TICKET_STATUSES).optional(),
  assignedAgentId: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export const replyTicketSchema = z.object({
  message: z.string().min(1),
  isInternal: z.boolean().optional()
});

export const assignTicketSchema = z.object({
  assignedAgentId: z.string().min(1)
});

export const userApprovalSchema = z.object({
  action: z.enum(['approve', 'reject']),
  feedback: z.string().optional()
}).superRefine((data, ctx) => {
  if (data.action === 'reject' && (!data.feedback || data.feedback.trim().length === 0)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Feedback is required when rejecting' });
  }
});
