import Card from '@/components/ui/Card';
import { Activity } from '@/types';
import { timeAgo } from '@/lib/utils';
import { getImageUrl } from '@/services/api';
import { Trophy, Users, Mountain, Calendar } from 'lucide-react';

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'hike_completed': return <Trophy className="h-4 w-4" />;
    case 'hike_joined': return <Mountain className="h-4 w-4" />;
    case 'group_created': return <Users className="h-4 w-4" />;
    case 'user_joined': return <Calendar className="h-4 w-4" />;
    default: return <Mountain className="h-4 w-4" />;
  }
};

const getActivityDescription = (activity: Activity): string => {
  const userName = typeof activity.user === 'string' ? 'You' : activity.user?.name || 'You';
  const trailName = typeof activity.trail === 'object' && activity.trail ? activity.trail.name : activity.trail || 'a trek';
  
  switch (activity.type) {
    case 'hike_completed': return `Completed ${trailName}`;
    case 'hike_joined': return `Joined ${trailName}`;
    case 'hike_cancelled': return `Cancelled ${trailName}`;
    case 'group_created': return `Created a group for ${trailName}`;
    case 'user_joined': return `${userName} joined the platform`;
    default: return 'Activity';
  }
};

export default function RecentActivity({ activities }: { activities: Activity[] }) {
  return (
    <Card className="p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.length === 0 && <p className="text-sm text-gray-400">No recent activity</p>}
        {activities.map((a, i) => {
          const userAvatar = typeof a.user === 'object' && a.user?.profileImage ? a.user.profileImage : null;
          return (
            <div key={a._id || i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0 overflow-hidden">
                {userAvatar ? (
                  <img src={getImageUrl(userAvatar)} alt="" className="w-full h-full object-cover" />
                ) : (
                  getActivityIcon(a.type)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 truncate">{getActivityDescription(a)}</p>
                <p className="text-xs text-gray-400 mt-0.5">{timeAgo(a.createdAt)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
