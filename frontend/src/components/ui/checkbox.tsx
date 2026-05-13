import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <input
      type="checkbox"
      className={cn(
        'h-4 w-4 rounded border border-slate-300 bg-white accent-blue-500 transition-colors',
        'checked:bg-blue-500 checked:border-blue-500',
        'hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'dark:border-slate-600 dark:bg-slate-900 dark:hover:border-slate-500 dark:focus:ring-offset-slate-950',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
