export interface ReportSummary {
  summary: {
    totalTickets: number;
    openTickets: number;
    resolvedTickets: number;
    closedTickets: number;
    totalUsers: number;
  };
  byPriority: Array<{ _id: string; count: number }>;
  byDepartment: Array<{ _id: string; count: number }>;
}
