import { api } from './api';
import type { ReportSummary } from '../types/report';

export async function getReportSummary() {
  const response = await api.get<ReportSummary>('/api/reports');
  return response.data;
}

export async function getMyReportSummary() {
  const response = await api.get<ReportSummary>('/api/reports/me');
  return response.data;
}

export async function exportReport(format: 'csv' | 'xlsx' | 'pdf') {
  const response = await api.get(`/api/reports/export?format=${format}`, { responseType: 'blob' });
  return response.data as Blob;
}
