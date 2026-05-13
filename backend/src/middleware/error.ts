import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/api-error.js';

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(new ApiError(404, 'Route not found'));
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ message: err.message, details: err.details ?? null });
    return;
  }

  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
}
