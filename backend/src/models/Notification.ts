import { Schema, model, type InferSchemaType } from 'mongoose';

const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    ticketId: { type: Schema.Types.ObjectId, ref: 'Ticket' },
    readAt: { type: Date }
  },
  { timestamps: true }
);

export type INotification = InferSchemaType<typeof notificationSchema>;
export const Notification = model('Notification', notificationSchema);
