import { Router } from 'express';
import { listNotifications, markRead, deleteNotification, markAllNotificationsRead, deleteAllNotifications } from '../controllers/notification.controller.js';
import { protect, permitPermissions } from '../middleware/auth.js';
import { PERMISSIONS } from '../constants/roles.js';

export const notificationRouter = Router();

notificationRouter.get('/', protect, permitPermissions(PERMISSIONS.NOTIFICATION_READ), listNotifications);
notificationRouter.patch('/mark-all-read', protect, permitPermissions(PERMISSIONS.NOTIFICATION_READ), markAllNotificationsRead);
notificationRouter.delete('/all', protect, permitPermissions(PERMISSIONS.NOTIFICATION_READ), deleteAllNotifications);
notificationRouter.patch('/:id/read', protect, permitPermissions(PERMISSIONS.NOTIFICATION_READ), markRead);
notificationRouter.delete('/:id', protect, permitPermissions(PERMISSIONS.NOTIFICATION_READ), deleteNotification);
