'use client';

import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef, useId } from 'react';
import { AlertCircle } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, type, prefixIcon, suffixIcon, id: propId, ...props }, ref) => {
    const autoId = useId();
    const inputId = propId || autoId;
    return (
      <div className="w-full space-y-1.5">
        {label && <label htmlFor={inputId} className="text-sm font-medium text-gray-700 leading-none">{label}</label>}
        <div className="relative">
          {prefixIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">{prefixIcon}</div>
          )}
          <input ref={ref} id={inputId} type={type} className={cn(
            'flex h-11 w-full rounded-xl border bg-white px-4 py-2 text-sm text-gray-900 shadow-sm transition-all duration-200',
            'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 hover:border-gray-400',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
            prefixIcon && 'pl-10',
            suffixIcon && 'pr-10',
            error ? 'border-red-300 focus:ring-red-500/40 focus:border-red-500' : 'border-gray-200', className
          )} {...props} />
          {suffixIcon && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">{suffixIcon}</div>
          )}
        </div>
        {error && <p className="flex items-center gap-1.5 text-sm text-red-500"><AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
// TODO: add debounced onChange for search inputs
