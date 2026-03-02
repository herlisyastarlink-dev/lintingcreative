import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-2xl font-semibold transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-slate-900 text-white hover:bg-slate-800 shadow-[0_4px_14px_0_rgb(0,0,0,0.2)]': variant === 'primary',
            'bg-white text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-sm': variant === 'secondary',
            'border-2 border-slate-900 text-slate-900 hover:bg-slate-50': variant === 'outline',
            'hover:bg-slate-100 text-slate-700': variant === 'ghost',
            'bg-red-500 text-white hover:bg-red-600 shadow-[0_4px_14px_0_rgb(239,68,68,0.3)]': variant === 'danger',
            'h-10 px-4 text-sm': size === 'sm',
            'h-12 px-6 text-base': size === 'md',
            'h-14 px-8 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
