import { AuditLog } from '../models/AuditLog.js';

export async function logAudit(input: {
  actorId?: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
  ip?: string;
  userAgent?: string;
}) {
  return AuditLog.create(input);
}
