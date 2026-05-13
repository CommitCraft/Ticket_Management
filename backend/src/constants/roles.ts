export const ROLE_KEYS = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  SUPPORT_AGENT: 'support_agent',
  USER: 'user'
} as const;

export type RoleKey = (typeof ROLE_KEYS)[keyof typeof ROLE_KEYS];

export const ALL_ROLE_KEYS: RoleKey[] = [
  ROLE_KEYS.SUPER_ADMIN,
  ROLE_KEYS.ADMIN,
  ROLE_KEYS.SUPPORT_AGENT,
  ROLE_KEYS.USER
];

export const PERMISSIONS = {
  USER_READ: 'user:read',
  USER_WRITE: 'user:write',
  ROLE_READ: 'role:read',
  ROLE_WRITE: 'role:write',
  PERMISSION_READ: 'permission:read',
  PERMISSION_WRITE: 'permission:write',
  DEPARTMENT_READ: 'department:read',
  DEPARTMENT_WRITE: 'department:write',
  TICKET_READ: 'ticket:read',
  TICKET_WRITE: 'ticket:write',
  TICKET_ASSIGN: 'ticket:assign',
  TICKET_INTERNAL_NOTE: 'ticket:internal-note',
  REPORT_READ: 'report:read',
  AUDIT_READ: 'audit:read',
  NOTIFICATION_READ: 'notification:read'
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
