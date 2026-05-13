import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

type BadgeVariant = 'default' | 'outline';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const badgeVariants: Record<BadgeVariant, string> = {
  default: 'bg-slate-900 text-white dark:bg-blue-500',
  outline: 'border border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', badgeVariants[variant], className)} {...props} />;
}
