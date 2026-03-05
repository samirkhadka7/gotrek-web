import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Trail } from '@/types';
import { getDifficultyColor, formatDuration } from '@/lib/utils';
import { MapPin, Clock, TrendingUp, Star } from 'lucide-react';
import { getImageUrl } from '@/services/api';

export default function TrailCard({ trail }: { trail: Trail }) {
  const avgRating = trail.averageRating
    ? trail.averageRating.toFixed(1)
    : trail.ratings && trail.ratings.length > 0
      ? (trail.ratings.reduce((sum, r) => sum + r.rating, 0) / trail.ratings.length).toFixed(1)
      : null;

  return (
    <Link href={`/trails/${trail._id}`}>
      <Card hover className="overflow-hidden group transition-all duration-300 hover:shadow-2xl">
        <div className="relative h-52 overflow-hidden bg-gray-100">
          <img
            src={trail.images?.[0] ? getImageUrl(trail.images[0]) : 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&auto=format&fit=crop'}
            alt={trail.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <Badge variant={getDifficultyColor(trail.difficulty) as 'success' | 'warning' | 'danger'}>{trail.difficulty}</Badge>
            {avgRating && (
              <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-lg">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span className="text-sm font-bold text-gray-800">{avgRating}</span>
              </div>
            )}
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-bold text-lg text-gray-900 truncate group-hover:text-blue-600 transition-colors">{trail.name}</h3>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{trail.description}</p>
          <div className="flex items-center gap-5 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{trail.distance} km</span>
            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{formatDuration(trail.duration)}</span>
            <span className="flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5" />{trail.elevation}m</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
// TODO: lazy load trail images for performance
