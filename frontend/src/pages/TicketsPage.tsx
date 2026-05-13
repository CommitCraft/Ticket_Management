import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '../components/ui/table';
import { listTickets } from '../services/tickets';
import { Badge } from '../components/ui/badge';
import { EmptyState } from '../components/layout/EmptyState';
import { useAppSelector } from '../hooks/useAppSelector';

export function TicketsPage() {
  const currentUser = useAppSelector((state) => state.auth.user);
  const [items, setItems] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [company, setCompany] = useState('');
  const [line, setLine] = useState('');
  const [ip, setIp] = useState('');
  const [operatorPhone, setOperatorPhone] = useState('');

  const loadTickets = async () => {
    const params: Record<string, string | number | undefined> = { q: query, status, priority, limit: 20 };
    if (company) params.companyName = company;
    if (line) params.lineOrStation = line;
    if (ip) params.ip = ip;
    if (operatorPhone) params.currentOperatorPhoneNumber = operatorPhone;
    const data = await listTickets(params);
    setItems(data.items);
  };

  useEffect(() => {
    void loadTickets();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tickets"
        description={currentUser?.roleKey === 'user' ? 'Your tickets' : 'Search, filter, and manage the full ticket queue.'}
        actions={<Link className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-blue-500 dark:hover:bg-blue-400" to="/tickets/new">Create Ticket</Link>}
      />

      {currentUser?.roleKey !== 'user' ? (
        <Card>
          <CardContent className="grid gap-3 md:grid-cols-6">
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search ticket ID, subject, description" />
            <Input value={company} onChange={(event) => setCompany(event.target.value)} placeholder="Company" />
            <Input value={line} onChange={(event) => setLine(event.target.value)} placeholder="Line / Station" />
            <Input value={ip} onChange={(event) => setIp(event.target.value)} placeholder="IP" />
            <Input value={operatorPhone} onChange={(event) => setOperatorPhone(event.target.value)} placeholder="Operator phone" />
            <Select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All statuses</option>
            <option value="open">Open</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="escalated">Escalated</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="reopened">Reopened</option>
          </Select>
          <Select value={priority} onChange={(event) => setPriority(event.target.value)}>
            <option value="">All priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
            </Select>
            <Select value={priority} onChange={(event) => setPriority(event.target.value)}>
              <option value="">All priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </Select>
            <Button onClick={() => void loadTickets()}>Search</Button>
          </CardContent>
        </Card>
      ) : null}

      {items.length === 0 ? (
        <EmptyState title="No tickets found" description="Create a ticket or adjust your filters to see results." actionLabel="Create ticket" onAction={() => window.location.assign('/tickets/new')} />
      ) : (
        <Card className="overflow-hidden p-0 border-slate-200 dark:border-slate-700 shadow-sm">
          <Table>
            <TableHead>
              <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b-2 border-slate-200 dark:border-slate-600">
                {currentUser?.roleKey === 'user' ? (
                  <>
                    <TableHeaderCell className="text-slate-700 dark:text-slate-200">🎫 Ticket</TableHeaderCell>
                    <TableHeaderCell className="text-slate-700 dark:text-slate-200">📝 Subject</TableHeaderCell>
                    <TableHeaderCell className="text-slate-700 dark:text-slate-200">⚡ Status</TableHeaderCell>
                    <TableHeaderCell className="text-slate-700 dark:text-slate-200">📅 Created</TableHeaderCell>
                    <TableHeaderCell className="text-slate-700 dark:text-slate-200">🔄 Updated</TableHeaderCell>
                  </>
                ) : (
                  <>
                    <TableHeaderCell className="text-slate-700 dark:text-slate-200">🎫 Ticket</TableHeaderCell>
                    <TableHeaderCell className="text-slate-700 dark:text-slate-200">🏢 Company</TableHeaderCell>
                    <TableHeaderCell className="text-slate-700 dark:text-slate-200">📍 Line / Station</TableHeaderCell>
                    <TableHeaderCell className="text-slate-700 dark:text-slate-200">🌐 IP</TableHeaderCell>
                    <TableHeaderCell className="text-slate-700 dark:text-slate-200">👤 Operator</TableHeaderCell>
                    <TableHeaderCell className="text-slate-700 dark:text-slate-200">📝 Subject</TableHeaderCell>
                    <TableHeaderCell className="text-slate-700 dark:text-slate-200">⚠️ Priority</TableHeaderCell>
                    <TableHeaderCell className="text-slate-700 dark:text-slate-200">⚡ Status</TableHeaderCell>
                    <TableHeaderCell className="text-slate-700 dark:text-slate-200">📅 Created</TableHeaderCell>
                    <TableHeaderCell className="text-slate-700 dark:text-slate-200">🔄 Updated</TableHeaderCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((ticket) => (
                <TableRow key={ticket._id} className="hover:bg-blue-50 dark:hover:bg-blue-900/10 border-b border-slate-100 dark:border-slate-800 transition">
                  {currentUser?.roleKey === 'user' ? (
                    <>
                      <TableCell className="font-semibold">
                        <Link to={`/tickets/${ticket._id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition">
                          {ticket.ticketId}
                        </Link>
                      </TableCell>
                      <TableCell className="text-slate-700 dark:text-slate-300">
                        <span className="line-clamp-1">{ticket.subject}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`capitalize border ${
                          ticket.status === 'open' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800' :
                          ticket.status === 'assigned' || ticket.status === 'in_progress' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800' :
                          ticket.status === 'resolved' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800' :
                          'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}>
                          {ticket.status.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {format(new Date(ticket.createdAt), 'dd MMM yyyy')}
                        <br />
                        <span className="text-xs text-slate-500 dark:text-slate-500">{format(new Date(ticket.createdAt), 'hh:mm a')}</span>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                        {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="font-semibold">
                        <Link to={`/tickets/${ticket._id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition">
                          {ticket.ticketId}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300">
                          {ticket.companyName || '—'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300">
                          {ticket.lineOrStation || '—'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-cyan-100 dark:bg-cyan-900/20 text-cyan-800 dark:text-cyan-300 px-2.5 py-1.5 rounded border border-cyan-200 dark:border-cyan-800 font-mono whitespace-nowrap">
                          {ticket.ip || '—'}
                        </code>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-2.5 py-1.5 rounded border border-green-200 dark:border-green-800 font-mono whitespace-nowrap">
                          {ticket.currentOperatorPhoneNumber || '—'}
                        </code>
                      </TableCell>
                      <TableCell className="text-slate-700 dark:text-slate-300">
                        <span className="line-clamp-1">{ticket.subject}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`border ${
                          ticket.priority === 'urgent' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800' :
                          ticket.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800' :
                          ticket.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800' :
                          'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800'
                        }`}>
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`border capitalize ${
                          ticket.status === 'open' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800' :
                          ticket.status === 'assigned' || ticket.status === 'in_progress' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800' :
                          ticket.status === 'resolved' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800' :
                          'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}>
                          {ticket.status.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {format(new Date(ticket.createdAt), 'dd MMM yyyy')}
                        <br />
                        <span className="text-xs text-slate-500 dark:text-slate-500">{format(new Date(ticket.createdAt), 'hh:mm a')}</span>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                        {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
