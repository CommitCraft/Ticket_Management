import { Schema, model, type InferSchemaType } from 'mongoose';
import { TICKET_PRIORITIES, TICKET_STATUSES } from '../constants/ticket.js';

const attachmentSchema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    mimeType: { type: String, default: '' },
    size: { type: Number, default: 0 }
  },
  { _id: false }
);

const timelineSchema = new Schema(
  {
    action: { type: String, required: true },
    note: { type: String, default: '' },
    by: { type: Schema.Types.ObjectId, ref: 'User' },
    at: { type: Date, default: Date.now },
    metadata: { type: Schema.Types.Mixed }
  },
  { _id: false }
);

const ticketSchema = new Schema(
  {
    ticketId: { type: String, required: true, unique: true, index: true },
    companyName: { type: String, required: true, trim: true },
    lineOrStation: { type: String, required: true, trim: true },
    ip: { type: String, required: true, trim: true },
    currentOperatorPhoneNumber: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    priority: { type: String, enum: TICKET_PRIORITIES, required: true },
    attachments: [attachmentSchema],
    assignedAgentId: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: TICKET_STATUSES, default: 'open' },
    slaDueAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lastActivityAt: { type: Date, default: Date.now },
    closedAt: { type: Date },
    reopenedCount: { type: Number, default: 0 },
    tags: [{ type: String }],
    watchers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    timeline: [timelineSchema],
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Add indexes for frequently filtered fields
ticketSchema.index({ companyName: 1 });
ticketSchema.index({ lineOrStation: 1 });
ticketSchema.index({ ip: 1 });
ticketSchema.index({ currentOperatorPhoneNumber: 1 });

export type ITicket = InferSchemaType<typeof ticketSchema>;
export const Ticket = model('Ticket', ticketSchema);
