import { Ticket } from '../models/Ticket.js';
import { User } from '../models/User.js';

export async function buildReportSummary() {
  const [totalTickets, openTickets, resolvedTickets, closedTickets, totalUsers] = await Promise.all([
    Ticket.countDocuments({ isDeleted: false }),
    Ticket.countDocuments({ status: { $in: ['open', 'assigned', 'in_progress', 'pending', 'escalated', 'reopened'] }, isDeleted: false }),
    Ticket.countDocuments({ status: 'resolved', isDeleted: false }),
    Ticket.countDocuments({ status: 'closed', isDeleted: false }),
    User.countDocuments({})
  ]);

  // SLA breaches: tickets with slaDueAt in the past and not resolved/closed
  const slaBreaches = await Ticket.countDocuments({
    isDeleted: false,
    slaDueAt: { $exists: true, $lte: new Date() },
    status: { $nin: ['resolved', 'closed'] }
  });

  const byPriority = await Ticket.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: '$priority', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  const byDepartment = await Ticket.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: '$departmentId', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  return {
    summary: { totalTickets, openTickets, resolvedTickets, closedTickets, totalUsers, slaBreaches },
    byPriority,
    byDepartment
  };
}

export async function buildUserReportSummary(userId: string) {
  const [totalTickets, openTickets, resolvedTickets] = await Promise.all([
    Ticket.countDocuments({ isDeleted: false, createdBy: userId }),
    Ticket.countDocuments({ status: { $in: ['open', 'assigned', 'in_progress', 'pending', 'escalated', 'reopened'] }, isDeleted: false, createdBy: userId }),
    Ticket.countDocuments({ status: 'resolved', isDeleted: false, createdBy: userId })
  ]);

  const slaBreaches = await Ticket.countDocuments({
    isDeleted: false,
    createdBy: userId,
    slaDueAt: { $exists: true, $lte: new Date() },
    status: { $nin: ['resolved', 'closed'] }
  });

  const byPriority = await Ticket.aggregate([
    { $match: { isDeleted: false, createdBy: userId } },
    { $group: { _id: '$priority', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  const byDepartment = await Ticket.aggregate([
    { $match: { isDeleted: false, createdBy: userId } },
    { $group: { _id: '$departmentId', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  return {
    summary: { totalTickets, openTickets, resolvedTickets, closedTickets: 0, totalUsers: 1, slaBreaches },
    byPriority,
    byDepartment
  };
}
