import type { Request, Response } from 'express';
import { Permission } from '../models/Permission.js';
import { Role } from '../models/Role.js';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import { logAudit } from '../services/audit.service.js';

export const listPermissions = asyncHandler(async (_req: Request, res: Response) => {
  const permissions = await Permission.find().sort({ createdAt: -1 });
  res.json({ items: permissions });
});

export const createPermission = asyncHandler(async (req: Request, res: Response) => {
  const permission = await Permission.create(req.body);
  await logAudit({ actorId: req.user?._id.toString(), action: 'create_permission', entityType: 'Permission', entityId: permission._id.toString(), after: permission, ip: req.ip, userAgent: req.get('user-agent') ?? '' });
  res.status(201).json({ permission });
});

export const updatePermission = asyncHandler(async (req: Request, res: Response) => {
  const permission = await Permission.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!permission) {
    throw new ApiError(404, 'Permission not found');
  }
  await logAudit({ actorId: req.user?._id.toString(), action: 'update_permission', entityType: 'Permission', entityId: permission._id.toString(), after: permission, ip: req.ip, userAgent: req.get('user-agent') ?? '' });
  res.json({ permission });
});

export const deletePermission = asyncHandler(async (req: Request, res: Response) => {
  const permission = await Permission.findById(req.params.id);
  if (!permission) {
    throw new ApiError(404, 'Permission not found');
  }

  const roleUsingPermission = await Role.findOne({ permissions: permission.key }).select('name key');
  if (roleUsingPermission) {
    throw new ApiError(400, `Permission is used by role ${roleUsingPermission.name} (${roleUsingPermission.key})`);
  }

  await permission.deleteOne();
  await logAudit({ actorId: req.user?._id.toString(), action: 'delete_permission', entityType: 'Permission', entityId: permission._id.toString(), before: permission, ip: req.ip, userAgent: req.get('user-agent') ?? '' });
  res.status(204).send();
});
