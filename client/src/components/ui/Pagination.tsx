'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  perPage?: number;
}

const getPageNumbers = (current: number, total: number): (number | '...')[] => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, '...', total];
  if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
};

export default function Pagination({ currentPage, totalPages, onPageChange, totalItems, perPage }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = getPageNumbers(currentPage, totalPages);
  return (
    <div className="flex flex-col items-center gap-2 mt-8">
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}
          className={cn('inline-flex items-center justify-center h-9 w-9 rounded-lg text-sm transition-all', 'hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none')}>
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((p, i) => (
          <button
            key={`${p}-${i}`}
            onClick={() => typeof p === 'number' && onPageChange(p)}
            disabled={p === '...'}
            className={cn(
              'inline-flex items-center justify-center h-9 w-9 rounded-lg text-sm font-medium transition-all',
              p === currentPage
                ? 'bg-linear-to-r from-blue-600 to-sky-600 text-white shadow-md'
                : p === '...'
                  ? 'cursor-default text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
            )}
          >
            {p}
          </button>
        ))}
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages}
          className={cn('inline-flex items-center justify-center h-9 w-9 rounded-lg text-sm transition-all', 'hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none')}>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      {totalItems !== undefined && perPage && (
        <p className="text-xs text-gray-500">
          Showing {Math.min((currentPage - 1) * perPage + 1, totalItems)}-{Math.min(currentPage * perPage, totalItems)} of {totalItems}
        </p>
      )}
    </div>
  );
}
// TODO: add keyboard navigation for page selection
