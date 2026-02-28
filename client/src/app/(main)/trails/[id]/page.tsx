'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { trailService } from '@/services/trail.service';
import { Trail } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import { getImageUrl } from '@/services/api';
import { MapPin, Clock, TrendingUp, Star, ArrowLeft, Calendar, Check, Mountain, Leaf, Sun, X } from 'lucide-react';
import { getDifficultyColor, formatDuration } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function TrailDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [trail, setTrail] = useState<Trail | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await trailService.getById(id as string);
        setTrail(res.data?.trail || res.data);
      } catch { toast.error('Trail not found'); router.push('/trails'); }
      setLoading(false);
    };
    load();
  }, [id, router]);

  const handleJoinTrail = async () => {
    if (!scheduledDate) { toast.error('Please select a date'); return; }
    setJoining(true);
    try {
      await trailService.joinWithDate(id as string, { scheduledDate });
      toast.success('Trail scheduled successfully!');
      setShowDatePicker(false);
      setScheduledDate('');
      await refreshUser();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to join trail');
    }
    setJoining(false);
  };

  const isJoined = user?.joinedTrails?.some(jt => {
    const trailId = typeof jt.trail === 'string' ? jt.trail : jt.trail?._id;
    return trailId === id;
  });
  const isCompleted = user?.completedTrails?.some(ct => {
    const trailId = typeof ct.trail === 'string' ? ct.trail : ct.trail?._id;
    return trailId === id;
  });

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!trail) return null;

  const ratings  = trail.ratings || [];
  const avgRating = trail.averageRating
    ? trail.averageRating.toFixed(1)
    : ratings.length
      ? (ratings.reduce((s, r) => s + r.rating, 0) / ratings.length).toFixed(1)
      : null;

  const diffColor = getDifficultyColor(trail.difficulty);
  const diffBadgeClass =
    diffColor === 'success' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
    diffColor === 'warning' ? 'bg-amber-100 text-amber-700 border-amber-200' :
    'bg-red-100 text-red-700 border-red-200';

  return (
    <div className="space-y-5 animate-fadeInUp">

      {/* ── Back button ── */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to trails
      </button>

      {/* ── Hero image ── */}
      <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl">
        <img
          src={trail.images?.[0] ? getImageUrl(trail.images[0]) : 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&auto=format&fit=crop'}
          alt={trail.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top-left difficulty badge */}
        <div className="absolute top-4 left-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${diffBadgeClass} bg-white/90 backdrop-blur-sm`}>
            {trail.difficulty}
          </span>
        </div>

        {/* Top-right rating */}
        {avgRating && (
          <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white text-xs font-semibold">
            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            {avgRating}
          </div>
        )}

        {/* Bottom overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white leading-tight">{trail.name}</h1>
            {trail.location && (
              <div className="flex items-center gap-1.5 mt-1 text-white/80 text-sm">
                <MapPin className="h-3.5 w-3.5" /> {trail.location}
              </div>
            )}
          </div>
          {user && (
            <div className="shrink-0">
              {isCompleted ? (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/90 backdrop-blur-sm text-white text-sm font-semibold">
                  <Check className="h-4 w-4" /> Completed
                </span>
              ) : isJoined ? (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500/90 backdrop-blur-sm text-white text-sm font-semibold">
                  <Calendar className="h-4 w-4" /> Scheduled
                </span>
              ) : (
                <button
                  onClick={() => setShowDatePicker(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-blue-600 text-sm font-semibold shadow-lg hover:bg-blue-50 transition-colors"
                >
                  <Calendar className="h-4 w-4" /> Schedule Trek
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Schedule date picker ── */}
      {showDatePicker && (
        <div className="bg-white rounded-2xl border border-blue-100 shadow-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Schedule Your Trek</h3>
            </div>
            <button onClick={() => setShowDatePicker(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex gap-3">
            <Input
              type="datetime-local"
              value={scheduledDate}
              onChange={e => setScheduledDate(e.target.value)}
              className="flex-1"
            />
            <button
              onClick={handleJoinTrail}
              disabled={joining}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {joining ? 'Saving...' : 'Schedule'}
            </button>
          </div>
        </div>
      )}

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: MapPin,    label: 'Distance',  value: `${trail.distance} km`,        bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-100' },
          { icon: Clock,     label: 'Duration',  value: formatDuration(trail.duration), bg: 'bg-amber-50',  text: 'text-amber-600',  border: 'border-amber-100' },
          { icon: TrendingUp,label: 'Elevation', value: `${trail.elevation}m`,          bg: 'bg-emerald-50',text: 'text-emerald-600',border: 'border-emerald-100' },
          { icon: Star,      label: 'Rating',    value: avgRating ?? 'N/A',             bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
        ].map((s, i) => (
          <div key={i} className={`bg-white rounded-2xl border ${s.border} p-4 flex items-center gap-3 shadow-sm`}>
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
              <s.icon className={`h-4.5 w-4.5 ${s.text}`} />
            </div>
            <div>
              <p className="text-base font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── About ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
            <Mountain className="h-4 w-4 text-emerald-600" />
          </div>
          <h2 className="text-sm font-semibold text-gray-900">About This Trail</h2>
        </div>
        <div className="p-5 space-y-4">
          {trail.description && (
            <p className="text-sm text-gray-600 leading-relaxed">{trail.description}</p>
          )}

          {trail.features && trail.features.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Leaf className="h-3.5 w-3.5 text-emerald-500" /> Features
              </p>
              <div className="flex flex-wrap gap-2">
                {trail.features.map((f, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {trail.seasons && trail.seasons.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Sun className="h-3.5 w-3.5 text-amber-500" /> Best Seasons
              </p>
              <div className="flex flex-wrap gap-2">
                {trail.seasons.map((s, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Reviews ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <Star className="h-4 w-4 text-amber-500" />
          </div>
          <h2 className="text-sm font-semibold text-gray-900">Reviews</h2>
          <span className="ml-auto text-xs text-gray-400 font-medium">{ratings.length} review{ratings.length !== 1 ? 's' : ''}</span>
        </div>

        {ratings.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {ratings.map((r, i) => {
              const reviewer = typeof r.user === 'object' ? r.user : null;
              return (
                <div key={i} className="px-5 py-4 flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-sky-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {reviewer?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">{reviewer?.name || 'User'}</span>
                        {r.createdAt && (
                          <span className="text-xs text-gray-400">
                            · {new Date(r.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`h-3.5 w-3.5 ${s <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                    {r.review && <p className="text-sm text-gray-600 leading-relaxed">{r.review}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
