import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Trail } from '@/types';
import { MapPin, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface UpcomingTrail extends Trail {
  scheduledDate?: string;
}

export default function UpcomingHikes({ trails }: { trails: UpcomingTrail[] }) {
  return (
    <Card className="p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Upcoming Treks</h3>
      <div className="space-y-3">
        {trails.length === 0 && <p className="text-sm text-gray-400">No upcoming treks scheduled</p>}
        {trails.map((t, idx) => (
          <div key={t._id || idx} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-sky-100 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{t.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Calendar className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500">{formatDate(t.scheduledDate || t.createdAt)}</span>
              </div>
            </div>
            <Badge variant={t.difficulty === 'Easy' ? 'success' : t.difficulty === 'Hard' ? 'danger' : 'warning'}>{t.difficulty}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
