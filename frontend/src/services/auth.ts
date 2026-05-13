import { api } from './api';
import type { AuthResponse } from '../types/auth';

export async function getProfileRequest() {
  const response = await api.get('/api/auth/me');
  return response.data;
}

export async function registerRequest(payload: { fullName: string; companyName: string; phoneNumber: string; email: string; password: string; departmentId?: string }) {
  const response = await api.post<AuthResponse>('/api/auth/register', payload);
  return response.data;
}

export async function loginRequest(payload: { email: string; password: string }) {
  const response = await api.post<AuthResponse>('/api/auth/login', payload);
  return response.data;
}

export async function logoutRequest() {
  const response = await api.post('/api/auth/logout');
  return response.data;
}

export async function forgotPasswordRequest(payload: { email: string }) {
  const response = await api.post('/api/auth/forgot-password', payload);
  return response.data;
}

export async function resetPasswordRequest(payload: { token: string; password: string }) {
  const response = await api.post('/api/auth/reset-password', payload);
  return response.data;
}

export async function changePasswordRequest(payload: { currentPassword: string; newPassword: string }) {
  const response = await api.post('/api/auth/change-password', payload);
  return response.data;
}

export async function updateProfileRequest(payload: { fullName: string; email: string }) {
  const response = await api.patch('/api/users/me', payload);
  return response.data;
}
