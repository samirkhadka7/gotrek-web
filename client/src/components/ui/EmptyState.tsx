import { Inbox } from 'lucide-react';
import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: { label: string; onClick: () => void } | React.ReactNode;
}

export default function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fadeInUp">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
        {icon || <Inbox className="h-8 w-8 text-blue-300" />}
      </div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      {description && <p className="mt-1.5 text-sm text-gray-500 max-w-sm">{description}</p>}
      {action && (
        <div className="mt-4">
          {React.isValidElement(action) ? action : (
            <button
              onClick={(action as { label: string; onClick: () => void }).onClick}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-sky-600 rounded-xl hover:shadow-lg transition-all"
            >
              {(action as { label: string; onClick: () => void }).label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
// TODO: add custom illustration support
