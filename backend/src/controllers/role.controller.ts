import type { Request, Response } from 'express';
import { Role } from '../models/Role.js';
import { Permission } from '../models/Permission.js';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import { logAudit } from '../services/audit.service.js';

export const listRoles = asyncHandler(async (_req: Request, res: Response) => {
  const roles = await Role.find().sort({ createdAt: -1 });
  res.json({ items: roles });
});

export const createRole = asyncHandler(async (req: Request, res: Response) => {
  const role = await Role.create(req.body);
  await logAudit({ actorId: req.user?._id.toString(), action: 'create_role', entityType: 'Role', entityId: role._id.toString(), after: role, ip: req.ip, userAgent: req.get('user-agent') ?? '' });
  res.status(201).json({ role });
});

export const updateRole = asyncHandler(async (req: Request, res: Response) => {
  const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!role) {
    throw new ApiError(404, 'Role not found');
  }
  await logAudit({ actorId: req.user?._id.toString(), action: 'update_role', entityType: 'Role', entityId: role._id.toString(), after: role, ip: req.ip, userAgent: req.get('user-agent') ?? '' });
  res.json({ role });
});

export const deleteRole = asyncHandler(async (req: Request, res: Response) => {
  const role = await Role.findByIdAndDelete(req.params.id);
  if (!role) {
    throw new ApiError(404, 'Role not found');
  }
  await logAudit({ actorId: req.user?._id.toString(), action: 'delete_role', entityType: 'Role', entityId: role._id.toString(), before: role, ip: req.ip, userAgent: req.get('user-agent') ?? '' });
  res.status(204).send();
});

export const listPermissions = asyncHandler(async (_req: Request, res: Response) => {
  const permissions = await Permission.find().sort({ createdAt: -1 });
  res.json({ items: permissions });
});
