import { Router } from 'express';
import { protect, permitPermissions } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { createTicketSchema, replyTicketSchema, updateTicketSchema } from '../validators/ticket.validator.js';
import { assignTicket, changeTicketStatus, createTicket, deleteTicket, getTicket, listTickets, replyToTicket, updateTicket } from '../controllers/ticket.controller.js';
import { PERMISSIONS } from '../constants/roles.js';
import { upload } from '../middleware/upload.js';
import { handleUploadError } from '../middleware/upload-error.js';

export const ticketRouter = Router();

const fileUpload = upload.array('attachments', 5);

// Wrapper to handle multer errors
const uploadHandler = (req: any, res: any, next: any) => {
  fileUpload(req, res, (err: any) => {
    if (err) return handleUploadError(err, req, res, next);
    next();
  });
};

ticketRouter.get('/', protect, permitPermissions(PERMISSIONS.TICKET_READ), listTickets);
ticketRouter.post('/', protect, permitPermissions(PERMISSIONS.TICKET_WRITE), uploadHandler, validateBody(createTicketSchema), createTicket);
ticketRouter.get('/:id', protect, permitPermissions(PERMISSIONS.TICKET_READ), getTicket);
ticketRouter.patch('/:id', protect, permitPermissions(PERMISSIONS.TICKET_WRITE), validateBody(updateTicketSchema), updateTicket);
ticketRouter.patch('/:id/assign', protect, permitPermissions(PERMISSIONS.TICKET_ASSIGN), assignTicket);
ticketRouter.patch('/:id/status', protect, permitPermissions(PERMISSIONS.TICKET_WRITE), changeTicketStatus);
ticketRouter.post('/:id/replies', protect, permitPermissions(PERMISSIONS.TICKET_WRITE), uploadHandler, validateBody(replyTicketSchema), replyToTicket);
ticketRouter.delete('/:id', protect, permitPermissions(PERMISSIONS.TICKET_WRITE), deleteTicket);
