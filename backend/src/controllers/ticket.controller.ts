import type { Request, Response } from 'express';
import { Ticket } from '../models/Ticket.js';
import { TicketReply } from '../models/TicketReply.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/api-error.js';
import { asyncHandler } from '../utils/async-handler.js';
import { createNotification } from '../services/notification.service.js';
import { logAudit } from '../services/audit.service.js';
import { addTicketReply, createTicketWithWorkflow } from '../services/ticket.service.js';
import { isValidImageType, isValidDocumentType } from '../middleware/upload.js';

function buildAttachments(files: Express.Multer.File[] | undefined) {
  return (files ?? []).map((file) => {
    // Determine subdirectory based on file type
    let subdir = 'documents';
    if (isValidImageType(file.mimetype)) {
      subdir = 'images';
    }
    
    return {
      name: file.originalname,
      url: `/uploads/${subdir}/${file.filename}`,
      mimeType: file.mimetype,
      size: file.size
    };
  });
}

export const listTickets = asyncHandler(async (req: Request, res: Response) => {
  const { status, priority, departmentId, assignedAgentId, q, page = '1', limit = '10', sort = '-createdAt', companyName, lineOrStation, ip, currentOperatorPhoneNumber } = req.query as Record<string, string>;
  const filter: Record<string, unknown> = { isDeleted: false };

  if (req.user?.roleKey === 'user') {
    filter.createdBy = req.user._id;
  }
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (departmentId) filter.departmentId = departmentId;
  if (assignedAgentId) filter.assignedAgentId = assignedAgentId;
  if (q) {
    filter.$or = [
      { subject: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { ticketId: { $regex: q, $options: 'i' } }
    ];
  }

  if (companyName) filter.companyName = { $regex: companyName, $options: 'i' };
  if (lineOrStation) filter.lineOrStation = { $regex: lineOrStation, $options: 'i' };
  if (ip) filter.ip = { $regex: ip, $options: 'i' };
  if (currentOperatorPhoneNumber) filter.currentOperatorPhoneNumber = { $regex: currentOperatorPhoneNumber, $options: 'i' };

  const pageNumber = Math.max(Number(page), 1);
  const pageSize = Math.min(Math.max(Number(limit), 1), 100);
  const skip = (pageNumber - 1) * pageSize;

  const [items, total] = await Promise.all([
    Ticket.find(filter).sort(sort).skip(skip).limit(pageSize).populate('departmentId assignedAgentId createdBy'),
    Ticket.countDocuments(filter)
  ]);

  res.json({ items, pagination: { total, page: pageNumber, limit: pageSize } });
});

export const createTicket = asyncHandler(async (req: Request, res: Response) => {
  const ticket = await createTicketWithWorkflow({
    ...req.body,
    createdBy: req.user!._id.toString(),
    attachments: buildAttachments(req.files as Express.Multer.File[] | undefined)
  });

  await logAudit({ actorId: req.user?._id.toString(), action: 'create_ticket', entityType: 'Ticket', entityId: ticket._id.toString(), after: ticket, ip: req.ip, userAgent: req.get('user-agent') ?? '' });
  res.status(201).json({ ticket });
});

export const getTicket = asyncHandler(async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id).populate('departmentId assignedAgentId createdBy timeline.by');
  if (!ticket || ticket.isDeleted) {
    throw new ApiError(404, 'Ticket not found');
  }

  // Check permissions based on role
  const ticketCreatorId = ticket.createdBy && (ticket.createdBy as any)._id ? String((ticket.createdBy as any)._id) : String(ticket.createdBy);
  const ticketAssignedId = ticket.assignedAgentId && (ticket.assignedAgentId as any)._id ? String((ticket.assignedAgentId as any)._id) : String(ticket.assignedAgentId);
  const isCreator = String(req.user?._id) === ticketCreatorId;
  const isAssigned = String(req.user?._id) === ticketAssignedId;
  const isAdmin = ['admin', 'super_admin'].includes(req.user?.roleKey || '');
  const isAgent = req.user?.roleKey === 'support_agent';

  // Users can only view tickets they created or are assigned to
  if (req.user?.roleKey === 'user' && !isCreator && !isAssigned) {
    throw new ApiError(403, 'You do not have permission to view this ticket');
  }

  // Agents can view any ticket
  // Admins can view any ticket
  // Super admins can view any ticket

  const replies = await TicketReply.find({ ticketId: ticket._id }).populate('authorId');
  res.json({ ticket, replies });
});

export const updateTicket = asyncHandler(async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket || ticket.isDeleted) {
    throw new ApiError(404, 'Ticket not found');
  }

  Object.assign(ticket, req.body);
  ticket.lastActivityAt = new Date();
  ticket.timeline.push({ action: 'updated', note: 'Ticket updated', by: req.user?._id.toString(), metadata: req.body });
  await ticket.save();

  await logAudit({ actorId: req.user?._id.toString(), action: 'update_ticket', entityType: 'Ticket', entityId: ticket._id.toString(), after: ticket, ip: req.ip, userAgent: req.get('user-agent') ?? '' });
  res.json({ ticket });
});

export const assignTicket = asyncHandler(async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket || ticket.isDeleted) {
    throw new ApiError(404, 'Ticket not found');
  }

  ticket.assignedAgentId = req.body.assignedAgentId;
  ticket.status = 'assigned';
  ticket.timeline.push({ action: 'assigned', note: 'Ticket assigned', by: req.user?._id.toString(), metadata: req.body });
  await ticket.save();
  await createNotification({ userId: req.body.assignedAgentId, type: 'ticket_assigned', title: `Ticket ${ticket.ticketId} assigned`, body: ticket.subject, ticketId: ticket._id.toString() });
  res.json({ ticket });
});

export const changeTicketStatus = asyncHandler(async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket || ticket.isDeleted) {
    throw new ApiError(404, 'Ticket not found');
  }

  ticket.status = req.body.status;
  if (req.body.status === 'resolved' || req.body.status === 'closed') {
    ticket.closedAt = new Date();
    // Notify ticket creator
    await createNotification({ userId: String(ticket.createdBy), type: 'ticket_resolved', title: `Ticket ${ticket.ticketId} updated`, body: `Status changed to ${req.body.status}`, ticketId: ticket._id.toString() });
    // Notify admins about high-priority resolved tickets
    if (['high', 'urgent'].includes(ticket.priority)) {
      const admins = await User.find({ roleKey: { $in: ['admin', 'super_admin'] } });
      for (const admin of admins) {
        if (String(admin._id) !== String(ticket.createdBy)) {
          await createNotification({ userId: String(admin._id), type: 'ticket_resolved', title: `High-priority ticket ${ticket.ticketId} ${req.body.status}`, body: ticket.subject, ticketId: ticket._id.toString() });
        }
      }
    }
  }
  if (req.body.status === 'reopened') {
    ticket.reopenedCount += 1;
  }
  ticket.timeline.push({ action: 'status_changed', note: `Status changed to ${req.body.status}`, by: req.user?._id.toString(), metadata: { status: req.body.status } });
  await ticket.save();
  res.json({ ticket });
});

export const replyToTicket = asyncHandler(async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket || ticket.isDeleted) {
    throw new ApiError(404, 'Ticket not found');
  }

  // Check permissions - allow creator, assigned agent, or admin/super_admin
  const isCreator = ticket.createdBy && (ticket.createdBy as any)._id ? String((ticket.createdBy as any)._id) === String(req.user?._id) : String(ticket.createdBy) === String(req.user?._id);
  const isAssigned = ticket.assignedAgentId && (ticket.assignedAgentId as any)._id ? String((ticket.assignedAgentId as any)._id) === String(req.user?._id) : String(ticket.assignedAgentId) === String(req.user?._id);
  const isAdmin = ['admin', 'super_admin'].includes(req.user?.roleKey || '');
  const isAgent = req.user?.roleKey === 'support_agent';

  // Users can only reply to tickets they created or are assigned to
  if (req.user?.roleKey === 'user' && !isCreator && !isAssigned) {
    throw new ApiError(403, 'You do not have permission to reply to this ticket');
  }

  // Agents can reply to any ticket
  // Admins can reply to any ticket
  // Super admins can reply to any ticket

  const reply = await addTicketReply({
    ticketId: req.params.id,
    authorId: req.user!._id.toString(),
    message: req.body.message,
    isInternal: req.body.isInternal,
    attachments: buildAttachments(req.files as Express.Multer.File[] | undefined)
  });
  const populatedReply = await TicketReply.findById(reply._id).populate('authorId');
  res.status(201).json({ reply: populatedReply });
});

export const deleteTicket = asyncHandler(async (req: Request, res: Response) => {
  const ticket = await Ticket.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
  if (!ticket) {
    throw new ApiError(404, 'Ticket not found');
  }
  res.status(204).send();
});
