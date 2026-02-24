'use client';

import { cn } from '@/lib/utils';
import { useId } from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

interface SelectProps { 
  label?: string; 
  error?: string; 
  options?: { value: string; label: string }[]; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; 
  className?: string; 
  placeholder?: string; 
  name?: string; 
  children?: React.ReactNode;
  required?: boolean;
}

export default function Select({ label, error, options, value, onChange, className, placeholder, name, children, required }: SelectProps) {
  const autoId = useId();
  const selectId = name || autoId;
  return (
    <div className="w-full space-y-1.5">
      {label && <label htmlFor={selectId} className="text-sm font-medium text-gray-700 leading-none">{label}</label>}
      <div className="relative">
        <select id={selectId} value={value} name={name} onChange={onChange} required={required} className={cn(
          'flex h-11 w-full appearance-none rounded-xl border bg-white px-4 py-2 pr-10 text-sm text-gray-900 shadow-sm transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 hover:border-gray-400',
          error ? 'border-red-300' : 'border-gray-200', className
        )}>
          {placeholder && <option value="">{placeholder}</option>}
          {options ? options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>) : children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
      {error && <p className="flex items-center gap-1.5 text-sm text-red-500"><AlertCircle className="h-3.5 w-3.5" />{error}</p>}
    </div>
  );
}
