import { format } from 'date-fns';

export function formatDateTime(value: string | Date, includeSeconds = false) {
  const date = value instanceof Date ? value : new Date(value);
  return format(date, includeSeconds ? 'dd MMM yyyy • hh:mm:ss a' : 'dd MMM yyyy • hh:mm a');
}