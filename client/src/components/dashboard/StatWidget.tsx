import Card from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatWidgetProps { label: string; value: string | number; change?: number; icon: React.ReactNode; }

export default function StatWidget({ label, value, change, icon }: StatWidgetProps) {
  return (
    <Card hover className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change !== undefined && (
            <div className={cn('flex items-center gap-1 mt-2 text-xs font-medium', change >= 0 ? 'text-blue-600' : 'text-red-500')}>
              {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">{icon}</div>
      </div>
    </Card>
  );
}
