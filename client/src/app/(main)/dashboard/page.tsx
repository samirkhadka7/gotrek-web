'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/services/user.service';
import { stepService } from '@/services/step.service';
import { Activity, User } from '@/types';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { getImageUrl } from '@/services/api';
import {
  Mountain, Users, Trophy, TrendingUp, Clock,
  Calendar, MapPin, Award, ArrowRight, Flame
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [totalSteps, setTotalSteps] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const profileRes = await userService.getMe();
        setProfile(profileRes.data || profileRes);
        if (user?._id) {
          try {
            const stepsRes = await stepService.getTotalForUser(user._id);
            setTotalSteps(stepsRes.data?.totalSteps || stepsRes.totalSteps || 0);
          } catch { setTotalSteps(0); }
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, [user?._id]);

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-40 bg-gray-200 rounded-2xl" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-gray-100 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 bg-gray-100 rounded-2xl" />
        <div className="h-64 bg-gray-100 rounded-2xl" />
      </div>
    </div>
  );

  const stats = (profile?.stats || {}) as any;
  const completedTrails = profile?.completedTrails || [];
  const joinedTrails = profile?.joinedTrails || [];
  const totalGroups = (stats.hikesJoined || 0) + (stats.hikesLed || 0);

  const upcomingHikes = (joinedTrails as any[])
    .map((jt) => ({ trail: typeof jt.trail === 'object' ? jt.trail : null, scheduledDate: jt.scheduledDate }))
    .filter((h) => h.trail)
    .slice(0, 5);

  const completedActivities: Activity[] = (completedTrails as any[]).slice(0, 3).map((ct, idx) => ({
    _id: `completed-${idx}`,
    type: 'hike_completed' as const,
    user: profile || user?.name || 'You',
    trail: typeof ct.trail === 'object' ? ct.trail : null,
    createdAt: ct.completedAt,
  }));

  const joinedActivities: Activity[] = (joinedTrails as any[]).slice(0, 2).map((jt, idx) => ({
    _id: `joined-${idx}`,
    type: 'hike_joined' as const,
    user: profile || user?.name || 'You',
    trail: typeof jt.trail === 'object' ? jt.trail : null,
    createdAt: jt.addedAt || jt.scheduledDate,
  }));

  const activities = [...completedActivities, ...joinedActivities]
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 5);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6 animate-fadeInUp">

      {/* ── Welcome Banner ── */}
      <div className="relative bg-linear-to-br from-blue-600 via-blue-600 to-sky-500 rounded-2xl p-6 text-white overflow-hidden shadow-xl shadow-blue-500/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {user?.profileImage ? (
              <img
                src={getImageUrl(user.profileImage)}
                alt={user.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-white/30 shadow-lg shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-2xl font-bold shadow-lg shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
            <div>
              <p className="text-blue-100 text-sm">{greeting()},</p>
              <h1 className="text-2xl font-bold">{user?.name}!</h1>
              <p className="text-blue-200 text-xs mt-0.5">
                {completedTrails.length > 0
                  ? `${completedTrails.length} trail${completedTrails.length > 1 ? 's' : ''} completed`
                  : 'Start your trekking journey'}
              </p>
            </div>
          </div>

          <Link
            href="/trails"
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap"
          >
            Explore Trails <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* ── Main Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Treks Done', value: stats.totalHikes || completedTrails.length, icon: Trophy, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Distance', value: `${stats.totalDistance || 0} km`, icon: MapPin, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
          { label: 'Elevation', value: `${stats.totalElevation || 0} m`, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
          { label: 'Hours', value: `${stats.totalHours || 0} h`, icon: Clock, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
        ].map((s, i) => (
          <div key={i} className={`bg-white rounded-2xl p-5 border ${s.border} hover:shadow-md transition-shadow`}>
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Secondary Stats ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Scheduled', value: joinedTrails.length, icon: Calendar, color: 'text-sky-600', bg: 'bg-sky-50' },
          { label: 'Groups', value: totalGroups, icon: Users, color: 'text-pink-600', bg: 'bg-pink-50' },
          { label: 'Steps', value: totalSteps.toLocaleString(), icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-3 hover:shadow-md transition-shadow">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Scheduled Treks + Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scheduled Treks */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              Scheduled Treks
              <span className="text-xs font-normal text-gray-400">({joinedTrails.length})</span>
            </h3>
            <Link href="/trails" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              Browse <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="p-4 space-y-2">
            {upcomingHikes.length === 0 ? (
              <EmptyState
                title="No scheduled treks"
                description="Browse trails and plan your next adventure"
                icon={<Calendar className="h-8 w-8 text-blue-200" />}
              />
            ) : (
              upcomingHikes.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50/50 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                      <Mountain className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{h.trail?.name || 'Trail'}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3 w-3" />
                        {new Date(h.scheduledDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <Badge variant={h.trail?.difficulty === 'Easy' ? 'success' : h.trail?.difficulty === 'Hard' ? 'danger' : 'warning'}>
                    {h.trail?.difficulty || 'Moderate'}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivity activities={activities} />
      </div>

      {/* ── Completed Trails ── */}
      {completedTrails.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-500" />
              Completed Trails
              <span className="text-xs font-normal text-gray-400">({completedTrails.length})</span>
            </h3>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {(completedTrails as any[]).slice(0, 6).map((ct, i) => {
              const trail = typeof ct.trail === 'object' ? ct.trail : null;
              return (
                <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50 hover:bg-emerald-100/60 rounded-xl transition-colors border border-emerald-100">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <Trophy className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{trail?.name || 'Trail'}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(ct.completedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
