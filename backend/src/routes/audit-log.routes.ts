import { Router } from 'express';
import { protect, permitPermissions } from '../middleware/auth.js';
import { PERMISSIONS } from '../constants/roles.js';
import { listAuditLogs } from '../controllers/auditLog.controller.js';

export const auditLogRouter = Router();

auditLogRouter.get('/', protect, permitPermissions(PERMISSIONS.AUDIT_READ), listAuditLogs);
