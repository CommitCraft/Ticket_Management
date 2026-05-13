import { Router } from 'express';
import { exportReport, getReportSummary, getMyReportSummary } from '../controllers/report.controller.js';
import { protect, permitPermissions } from '../middleware/auth.js';
import { PERMISSIONS } from '../constants/roles.js';

export const reportRouter = Router();

reportRouter.get('/', protect, permitPermissions(PERMISSIONS.REPORT_READ), getReportSummary);
reportRouter.get('/me', protect, getMyReportSummary);
reportRouter.get('/export', protect, permitPermissions(PERMISSIONS.REPORT_READ), exportReport);
