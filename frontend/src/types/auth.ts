export type RoleKey = 'super_admin' | 'admin' | 'support_agent' | 'user';

export interface DepartmentSummary {
  _id: string;
  name: string;
  slug: string;
}

export interface User {
  _id: string;
  fullName: string;
  companyName?: string;
  phoneNumber?: string;
  email: string;
  roleKey: RoleKey;
  permissions: string[];
  departmentId?: DepartmentSummary | string;
  status: 'active' | 'disabled';
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}
