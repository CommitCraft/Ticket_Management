import { Schema, model, type InferSchemaType } from 'mongoose';

const replyAttachmentSchema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    mimeType: { type: String, default: '' },
    size: { type: Number, default: 0 }
  },
  { _id: false }
);

const ticketReplySchema = new Schema(
  {
    ticketId: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    isInternal: { type: Boolean, default: false },
    attachments: [replyAttachmentSchema]
  },
  { timestamps: true }
);

export type ITicketReply = InferSchemaType<typeof ticketReplySchema>;
export const TicketReply = model('TicketReply', ticketReplySchema);
