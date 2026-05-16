import { api } from './api';
import type { User } from '../types/auth';

export async function listUsers() {
  const response = await api.get<{ items: User[] }>('/api/users');
  return response.data.items;
}

export async function createUser(payload: { fullName: string; email: string; password: string; companyName?: string; phoneNumber?: string; roleKey?: string; departmentId?: string }) {
  const response = await api.post<{ user: User }>('/api/users', payload);
  return response.data.user;
}

export async function updateUser(id: string, payload: Record<string, unknown>) {
  const response = await api.patch<{ user: User }>(`/api/users/${id}`, payload);
  return response.data.user;
}

export async function listRoles() {
  const response = await api.get<{ items: Array<{ _id: string; key: string; name: string; description?: string; permissions: string[]; isSystem?: boolean }> }>('/api/roles');
  return response.data.items;
}

export async function listDepartments() {
  const response = await api.get<{ items: Array<{ _id: string; name: string; slug: string }> }>('/api/departments');
  return response.data.items;
}
