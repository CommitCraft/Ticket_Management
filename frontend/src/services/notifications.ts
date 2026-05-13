import { api } from './api';

export async function listNotifications() {
  const response = await api.get<{ items: Array<{ _id: string; type: string; title: string; body: string; readAt?: string; createdAt: string; ticketId?: string }> }>('/api/notifications');
  return response.data.items;
}

export async function markNotificationRead(id: string) {
  const response = await api.patch(`/api/notifications/${id}/read`);
  return response.data;
}

export async function deleteNotification(id: string) {
  const response = await api.delete(`/api/notifications/${id}`);
  return response.data;
}

export async function markAllNotificationsRead() {
  const response = await api.patch(`/api/notifications/mark-all-read`);
  return response.data;
}

export async function deleteAllNotifications() {
  const response = await api.delete(`/api/notifications/all`);
  return response.data;
}
