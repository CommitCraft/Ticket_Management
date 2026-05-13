export type TicketStatus = 'open' | 'assigned' | 'in_progress' | 'pending' | 'escalated' | 'resolved' | 'closed' | 'reopened';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TicketAttachment {
  name: string;
  url: string;
  mimeType?: string;
  size?: number;
}

export interface TicketReply {
  _id: string;
  ticketId: string;
  message: string;
  isInternal: boolean;
  attachments?: TicketAttachment[];
  authorId?: { _id: string; fullName: string; email: string } | string;
  createdAt: string;
}

export interface Ticket {
  _id: string;
  ticketId: string;
  companyName: string;
  lineOrStation: string;
  ip: string;
  currentOperatorPhoneNumber: string;
  subject: string;
  description: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  departmentId?: { _id: string; name: string } | string;
  assignedAgentId?: { _id: string; fullName: string; email: string } | string;
  createdBy?: { _id: string; fullName: string; email: string } | string;
  slaDueAt?: string;
  createdAt: string;
  updatedAt: string;
  attachments?: TicketAttachment[];
  timeline?: Array<{ action: string; note?: string; by?: string; at?: string }>;
}
