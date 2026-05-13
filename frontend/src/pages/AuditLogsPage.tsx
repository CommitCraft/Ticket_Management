import { useEffect, useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardContent } from '../components/ui/card';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from '../components/ui/table';
import { api } from '../services/api';
import { format } from 'date-fns';
import { X } from 'lucide-react';

interface AuditLog {
  _id: string;
  actorId: { _id: string; fullName: string; email: string } | null;
  action: string;
  entityType: string;
  entityId: string;
  before: Record<string, any>;
  after: Record<string, any>;
  ip: string;
  userAgent: string;
  createdAt: string;
}

export function AuditLogsPage() {
  const [items, setItems] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const response = await api.get('/api/audit-logs');
        setItems(response.data.items ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const formatJsonChange = (before: any, after: any) => {
    const changes: string[] = [];
    if (!before || !after) return 'N/A';
    
    const allKeys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})]);
    allKeys.forEach((key) => {
      if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
        changes.push(`${key}: ${JSON.stringify(before[key])} → ${JSON.stringify(after[key])}`);
      }
    });
    
    return changes.length > 0 ? changes.join(', ') : 'No changes';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Audit Logs" description="Security-sensitive user actions and system mutations." />
        <Card>
          <CardContent>
            <p className="text-slate-500">Loading audit logs...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Logs" description="Security-sensitive user actions and system mutations." />
      
      <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
        <CardContent className="p-0">
          {items.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-500 dark:text-slate-400">📋 No audit logs found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b-2 border-slate-200 dark:border-slate-600">
                    <TableHeaderCell className="text-slate-700 dark:text-slate-200">👤 Actor</TableHeaderCell>
                    <TableHeaderCell className="text-slate-700 dark:text-slate-200">⚡ Action</TableHeaderCell>
                    <TableHeaderCell className="text-slate-700 dark:text-slate-200">📋 Entity</TableHeaderCell>
                    <TableHeaderCell className="text-slate-700 dark:text-slate-200">📊 Changes</TableHeaderCell>
                    <TableHeaderCell className="text-slate-700 dark:text-slate-200">🌐 IP Address</TableHeaderCell>
                    <TableHeaderCell className="text-slate-700 dark:text-slate-200">🕐 Timestamp</TableHeaderCell>
                    <TableHeaderCell className="text-slate-700 dark:text-slate-200 text-center">📖 Action</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((log) => (
                    <TableRow key={log._id} className="hover:bg-blue-50 dark:hover:bg-blue-900/10 border-b border-slate-100 dark:border-slate-800 transition">
                      <TableCell className="font-medium">
                        {log.actorId ? (
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2.5">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{log.actorId.fullName}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">{log.actorId.email}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 italic">System</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1.5 text-xs font-semibold text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          {log.action}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2.5">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{log.entityType}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 truncate max-w-xs">{log.entityId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs max-w-xs truncate text-slate-700 dark:text-slate-300" title={formatJsonChange(log.before, log.after)}>
                          {formatJsonChange(log.before, log.after)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-cyan-100 dark:bg-cyan-900/20 text-cyan-800 dark:text-cyan-300 px-2.5 py-1.5 rounded border border-cyan-200 dark:border-cyan-800 font-mono whitespace-nowrap">
                          {log.ip && log.ip.trim() ? log.ip : '—'}
                        </code>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {format(new Date(log.createdAt), 'dd MMM yyyy')}
                        <br />
                        <span className="text-xs text-slate-500 dark:text-slate-500">{format(new Date(log.createdAt), 'hh:mm a')}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition border border-blue-200 dark:border-blue-800"
                        >
                          View
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Popup for Details */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border-slate-200 dark:border-slate-700">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Audit Log Details</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">{selectedLog._id}</p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto flex-1">
              <CardContent className="p-6 space-y-6">
                {/* Row 1: Actor & Action */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">👤 Actor</p>
                    <div className="mt-3">
                      {selectedLog.actorId ? (
                        <>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedLog.actorId.fullName}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{selectedLog.actorId.email}</p>
                        </>
                      ) : (
                        <p className="text-sm text-slate-500 dark:text-slate-400 italic">System Action</p>
                      )}
                    </div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                    <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">⚡ Action</p>
                    <div className="mt-3">
                      <span className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900 px-3 py-1.5 text-xs font-semibold text-purple-800 dark:text-purple-200">
                        {selectedLog.action}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 2: Entity Type & Entity ID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">📋 Entity Type</p>
                    <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">{selectedLog.entityType}</p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">🔑 Entity ID</p>
                    <code className="mt-3 inline-block text-xs bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800 px-2.5 py-1.5 rounded font-mono text-slate-700 dark:text-slate-300 break-all">
                      {selectedLog.entityId}
                    </code>
                  </div>
                </div>

                {/* Row 3: Timestamp & IP */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-200 dark:border-slate-700 pt-6">
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">🕐 Timestamp</p>
                    <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                      {format(new Date(selectedLog.createdAt), 'dd MMM yyyy')}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {format(new Date(selectedLog.createdAt), 'hh:mm:ss a')}
                    </p>
                  </div>
                  <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg p-4">
                    <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">🌐 IP Address</p>
                    <code className="mt-3 inline-block text-xs bg-white dark:bg-slate-800 border border-cyan-200 dark:border-cyan-800 px-2.5 py-1.5 rounded font-mono text-slate-700 dark:text-slate-300">
                      {selectedLog.ip && selectedLog.ip.trim() ? selectedLog.ip : '—'}
                    </code>
                  </div>
                </div>

                {/* Row 4: Before & After Changes */}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-4">📊 Data Changes</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center gap-1">
                        <span className="text-lg">●</span> Before
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg p-4 space-y-2 max-h-80 overflow-y-auto">
                        {selectedLog.before && Object.keys(selectedLog.before).length > 0 ? (
                          Object.entries(selectedLog.before).map(([key, value]) => (
                            <div key={key} className="flex flex-col">
                              <span className="text-xs font-semibold text-red-700 dark:text-red-300">{key}</span>
                              <span className="text-xs text-slate-700 dark:text-slate-300 break-all pl-2 border-l-2 border-red-300 dark:border-red-700 py-1 mt-1">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-500 dark:text-slate-400 italic">No previous data</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-1">
                        <span className="text-lg">●</span> After
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-lg p-4 space-y-2 max-h-80 overflow-y-auto">
                        {selectedLog.after && Object.keys(selectedLog.after).length > 0 ? (
                          Object.entries(selectedLog.after).map(([key, value]) => (
                            <div key={key} className="flex flex-col">
                              <span className="text-xs font-semibold text-green-700 dark:text-green-300">{key}</span>
                              <span className="text-xs text-slate-700 dark:text-slate-300 break-all pl-2 border-l-2 border-green-300 dark:border-green-700 py-1 mt-1">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-500 dark:text-slate-400 italic">No changes recorded</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 5: User Agent */}
                {selectedLog.userAgent && (
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">🔍 User Agent</p>
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                      <p className="text-xs text-slate-700 dark:text-slate-300 break-words font-mono">
                        {selectedLog.userAgent}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-6 py-4 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition"
              >
                Close
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
