import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Group } from '@/types';
import { Users, MapPin } from 'lucide-react';
import { getImageUrl } from '@/services/api';

export default function GroupCard({ group }: { group: Group }) {
  const memberCount = group.participants?.length || 0;
  const maxMembers = group.maxSize || 10;
  const progress = Math.min((memberCount / maxMembers) * 100, 100);

  return (
    <Link href={`/groups/${group._id}`}>
      <Card hover className="overflow-hidden group">
        <div className="relative h-40 overflow-hidden">
          <img
            src={
              group.photos && group.photos[0] 
                ? `${getImageUrl(group.photos[0])}?t=${Date.now()}` 
                : 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&auto=format&fit=crop'
            }
            alt={group.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-gray-900 truncate">{group.title}</h3>
            <Badge variant="info">{group.status || 'Active'}</Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{group.description}</p>
          {group.trail && (
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
              <MapPin className="h-3 w-3" /> {typeof group.trail === 'string' ? group.trail : group.trail.name}
            </div>
          )}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {memberCount}/{maxMembers} members</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-sky-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
