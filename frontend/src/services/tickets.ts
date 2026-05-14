import { api } from './api';
import type { Ticket, TicketReply } from '../types/ticket';

export async function listTickets(params?: Record<string, string | number | undefined>) {
  const response = await api.get<{ items: Ticket[]; pagination: { total: number; page: number; limit: number } }>('/api/tickets', { params });
  return response.data;
}

export async function getTicket(id: string) {
  const response = await api.get<{ ticket: Ticket; replies: TicketReply[] }>(`/api/tickets/${id}`);
  return response.data;
}

export async function createTicket(formData: FormData) {
  const response = await api.post<{ ticket: Ticket }>('/api/tickets', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return response.data;
}

export async function updateTicket(id: string, payload: Record<string, unknown>) {
  const response = await api.patch<{ ticket: Ticket }>(`/api/tickets/${id}`, payload);
  return response.data;
}

export async function replyToTicket(id: string, message: string) {
  const response = await api.post(`/api/tickets/${id}/replies`, { message });
  return response.data;
}

export async function changeTicketStatus(id: string, status: string) {
  const response = await api.patch<{ ticket: Ticket }>(`/api/tickets/${id}/status`, { status });
  return response.data;
}

export async function listAssignableUsers(departmentId?: string) {
  const response = await api.get<{ items: Array<{ _id: string; fullName: string; email: string; roleKey: string }> }>('/api/tickets/assignable-users', {
    params: { departmentId }
  });
  return response.data.items;
}

export async function assignTicketToUser(ticketId: string, assignedAgentId: string) {
  const response = await api.patch<{ ticket: Ticket }>(`/api/tickets/${ticketId}/assign`, { assignedAgentId });
  return response.data;
}
