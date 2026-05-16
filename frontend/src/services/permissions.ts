import { api } from './api';

export interface Permission {
  _id?: string;
  key: string;
  name: string;
  description?: string;
  module?: string;
  createdAt?: string;
}

export interface Role {
  _id: string;
  key: string;
  name: string;
  description?: string;
  permissions: string[];
  isSystem?: boolean;
  createdAt?: string;
}

export async function listPermissions() {
  const response = await api.get<{ items: Permission[] }>('/api/permissions');
  return response.data.items;
}

export async function listRoles() {
  const response = await api.get<{ items: Role[] }>('/api/roles');
  return response.data.items;
}

export async function getAvailablePermissions() {
  const response = await api.get<{ items: Permission[] }>('/api/roles/permissions');
  return response.data.items;
}

export async function updateRolePermissions(roleId: string, permissions: string[]) {
  const response = await api.patch<{ role: Role }>(`/api/roles/${roleId}`, { permissions });
  return response.data.role;
}

export async function getRoleById(roleId: string) {
  const response = await api.get<{ role: Role }>(`/api/roles/${roleId}`);
  return response.data.role;
}
