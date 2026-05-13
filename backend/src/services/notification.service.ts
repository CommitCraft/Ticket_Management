import { Notification } from '../models/Notification.js';
import { Types } from 'mongoose';

export async function createNotification(input: {
  userId: string;
  type: string;
  title: string;
  body: string;
  ticketId?: string;
}) {
  return Notification.create({
    userId: new Types.ObjectId(input.userId),
    type: input.type,
    title: input.title,
    body: input.body,
    ticketId: input.ticketId ? new Types.ObjectId(input.ticketId) : undefined
  });
}

export async function markNotificationAsRead(notificationId: string) {
  return Notification.findByIdAndUpdate(notificationId, { readAt: new Date() }, { new: true });
}
