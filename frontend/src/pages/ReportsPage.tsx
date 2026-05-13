import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { exportReport, getReportSummary } from '../services/reports';
import { useAppSelector } from '../hooks/useAppSelector';
import { toast } from 'sonner';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export function ReportsPage() {
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.auth.user);
  const [report, setReport] = useState<any>(null);

  // Only admins and super admins can access reports
  if (currentUser && !['admin', 'support_agent', 'super_admin'].includes(currentUser.roleKey)) {
    return (
      <div className="space-y-6">
        <PageHeader title="Access Denied" description="You do not have permission to view reports." />
        <Card>
          <CardContent className="py-12 text-center">
            <div className="space-y-3">
              <p className="text-lg font-semibold text-slate-900 dark:text-white">Reports are only available for support team members.</p>
              <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  useEffect(() => {
    void getReportSummary().then(setReport);
  }, []);

  const download = async (format: 'csv' | 'xlsx' | 'pdf') => {
    const blob = await exportReport(format);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `helpdesk-report.${format === 'xlsx' ? 'xlsx' : format === 'pdf' ? 'pdf' : 'csv'}`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Export ticket and performance data in formats that finance and operations can consume."
        actions={
          <>
            <Button variant="outline" onClick={() => void download('csv')}>CSV Export</Button>
            <Button variant="outline" onClick={() => void download('xlsx')}>Excel Export</Button>
            <Button onClick={() => void download('pdf')}>PDF Export</Button>
          </>
        }
      />
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent><p className="text-sm text-slate-500">Total Tickets</p><p className="text-3xl font-bold">{report?.summary?.totalTickets ?? 0}</p></CardContent></Card>
        <Card><CardContent><p className="text-sm text-slate-500">Open Tickets</p><p className="text-3xl font-bold">{report?.summary?.openTickets ?? 0}</p></CardContent></Card>
        <Card><CardContent><p className="text-sm text-slate-500">Resolved Tickets</p><p className="text-3xl font-bold">{report?.summary?.resolvedTickets ?? 0}</p></CardContent></Card>
        <Card><CardContent><p className="text-sm text-slate-500">Closed Tickets</p><p className="text-3xl font-bold">{report?.summary?.closedTickets ?? 0}</p></CardContent></Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Priority Wise Tickets</CardTitle></CardHeader>
          <CardContent>
            <Bar data={{ labels: report?.byPriority?.map((item: any) => item._id) ?? [], datasets: [{ data: report?.byPriority?.map((item: any) => item.count) ?? [], backgroundColor: '#2563eb' }] }} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Department Wise Tickets</CardTitle></CardHeader>
          <CardContent>
            <Doughnut data={{ labels: report?.byDepartment?.map((item: any) => String(item._id)) ?? [], datasets: [{ data: report?.byDepartment?.map((item: any) => item.count) ?? [], backgroundColor: ['#2563eb', '#0ea5e9', '#14b8a6', '#f59e0b'] }] }} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
