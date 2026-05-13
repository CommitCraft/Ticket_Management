import type { Request, Response } from 'express';
import { Department } from '../models/Department.js';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import { logAudit } from '../services/audit.service.js';

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const listDepartments = asyncHandler(async (_req: Request, res: Response) => {
  const departments = await Department.find().sort({ createdAt: -1 });
  res.json({ items: departments });
});

export const createDepartment = asyncHandler(async (req: Request, res: Response) => {
  const department = await Department.create({
    ...req.body,
    slug: req.body.slug ?? slugify(req.body.name)
  });
  await logAudit({ actorId: req.user?._id.toString(), action: 'create_department', entityType: 'Department', entityId: department._id.toString(), after: department, ip: req.ip, userAgent: req.get('user-agent') ?? '' });
  res.status(201).json({ department });
});

export const updateDepartment = asyncHandler(async (req: Request, res: Response) => {
  const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!department) {
    throw new ApiError(404, 'Department not found');
  }
  await logAudit({ actorId: req.user?._id.toString(), action: 'update_department', entityType: 'Department', entityId: department._id.toString(), after: department, ip: req.ip, userAgent: req.get('user-agent') ?? '' });
  res.json({ department });
});

export const deleteDepartment = asyncHandler(async (req: Request, res: Response) => {
  const department = await Department.findByIdAndDelete(req.params.id);
  if (!department) {
    throw new ApiError(404, 'Department not found');
  }
  await logAudit({ actorId: req.user?._id.toString(), action: 'delete_department', entityType: 'Department', entityId: department._id.toString(), before: department, ip: req.ip, userAgent: req.get('user-agent') ?? '' });
  res.status(204).send();
});
