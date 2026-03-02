import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
        <input
          ref={ref}
          className={cn(
            'flex h-12 w-full rounded-2xl border-0 bg-slate-100/80 px-4 py-3 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none shadow-inner shadow-slate-200/50 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'ring-2 ring-red-500 focus:ring-red-500 bg-red-50',
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
