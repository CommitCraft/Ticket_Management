import type { Request, Response } from 'express';
import { AuditLog } from '../models/AuditLog.js';
import { asyncHandler } from '../utils/async-handler.js';

export const listAuditLogs = asyncHandler(async (_req: Request, res: Response) => {
  const items = await AuditLog.find().sort({ createdAt: -1 }).populate('actorId');
  res.json({ items });
});
