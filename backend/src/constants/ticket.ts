export const TICKET_STATUSES = [
  'open',
  'assigned',
  'in_progress',
  'pending',
  'pending_user_approval',
  'escalated',
  'resolved',
  'closed',
  'reopened'
] as const;

export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const TICKET_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];
