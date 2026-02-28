'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminService } from '@/services/admin.service';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import StatWidget from '@/components/dashboard/StatWidget';
import { getImageUrl } from '@/services/api';
import { timeAgo } from '@/lib/utils';
import {
  Users, Mountain, CreditCard, Footprints,
  Activity as ActivityIcon, ArrowRight, TrendingUp,
  CheckCircle, XCircle, UserCheck
} from 'lucide-react';

type AnalyticsSummary = {
  totalUsers?: { total: number; percentageChange?: number };
  totalRevenue?: { total: number; percentageChange?: number };
  completedHikes?: { total: number; scheduledThisMonth?: number };
};
type AnalyticsData = {
  userGrowth?: Array<{ _id: number; users: number }>;
  hikeData?: Array<{ _id: number; completed: number; cancelled: number }>;
  summary?: AnalyticsSummary;
};
type RecentActivityItem = {
  id: string; type: string; user: string; avatar?: string | null;
  trail?: string | null; time: string;
};

const activityLabel: Record<string, { label: string; color: string }> = {
  user_joined:    { label: 'joined the platform', color: 'bg-blue-100 text-blue-600' },
  group_created:  { label: 'created a group',     color: 'bg-violet-100 text-violet-600' },
  hike_joined:    { label: 'joined a trek',        color: 'bg-sky-100 text-sky-600' },
  hike_completed: { label: 'completed a trek',     color: 'bg-emerald-100 text-emerald-600' },
  hike_cancelled: { label: 'cancelled a trek',     color: 'bg-red-100 text-red-500' },
};

const quickLinks = [
  { href: '/admin/users',    label: 'Manage Users',   icon: Users,     color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { href: '/admin/trails',   label: 'Manage Trails',  icon: Mountain,  color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { href: '/admin/groups',   label: 'Manage Groups',  icon: UserCheck, color: 'bg-violet-50 text-violet-600 border-violet-100' },
  { href: '/admin/payments', label: 'Payments',       icon: CreditCard,color: 'bg-amber-50 text-amber-600 border-amber-100' },
];

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({});
  const [activities, setActivities] = useState<RecentActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [analyticsRes, activityRes] = await Promise.all([
          adminService.getDashboard(),
          adminService.getRecentActivities(),
        ]);
        setAnalytics(analyticsRes?.data || analyticsRes || {});
        setActivities(activityRes?.data || activityRes || []);
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (error) return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
        <XCircle className="h-6 w-6 text-red-500" />
      </div>
      <p className="text-base font-semibold text-gray-900">Failed to load dashboard</p>
      <p className="text-sm text-gray-400">{error}</p>
    </div>
  );

  const summary = analytics.summary || {};
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const userGrowth = analytics.userGrowth || [];
  const hikeData = analytics.hikeData || [];

  return (
    <div className="space-y-6 animate-fadeInUp">

      {/* ── Header Banner ── */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 text-white overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-gray-300 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Admin Panel
          </div>
          <h1 className="text-2xl font-bold">Platform Overview</h1>
          <p className="text-gray-400 mt-1 text-sm">Monitor users, trails, and revenue in one place.</p>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatWidget label="Total Users"          value={summary.totalUsers?.total || 0}         change={summary.totalUsers?.percentageChange}  icon={<Users className="h-5 w-5" />} />
        <StatWidget label="Total Revenue"        value={`Rs. ${summary.totalRevenue?.total || 0}`} change={summary.totalRevenue?.percentageChange} icon={<CreditCard className="h-5 w-5" />} />
        <StatWidget label="Completed Treks"      value={summary.completedHikes?.total || 0}     icon={<Mountain className="h-5 w-5" />} />
        <StatWidget label="Scheduled This Month" value={summary.completedHikes?.scheduledThisMonth || 0} icon={<Footprints className="h-5 w-5" />} />
      </div>

      {/* ── Quick Nav ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {quickLinks.map((q) => (
          <Link key={q.href} href={q.href}
            className={`flex items-center gap-3 p-4 rounded-2xl border bg-white hover:shadow-md transition-all group ${q.color}`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${q.color}`}>
              <q.icon className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold text-gray-800 flex-1">{q.label}</span>
            <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>

      {/* ── Analytics + Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Analytics */}
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Analytics Overview</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Growth */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">User Growth (This Year)</p>
              {userGrowth.length === 0
                ? <p className="text-sm text-gray-400">No data available</p>
                : <div className="space-y-2">
                    {userGrowth.map((item) => {
                      const max = Math.max(...userGrowth.map(u => u.users), 1);
                      const pct = Math.round((item.users / max) * 100);
                      return (
                        <div key={item._id}>
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>{monthNames[item._id - 1] || `M${item._id}`}</span>
                            <span className="font-semibold text-gray-900">{item.users}</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
              }
            </div>

            {/* Trek Stats */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Treks: Completed vs Cancelled</p>
              {hikeData.length === 0
                ? <p className="text-sm text-gray-400">No data available</p>
                : <div className="space-y-2.5">
                    {hikeData.map((item) => (
                      <div key={item._id} className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 w-8">{monthNames[item._id - 1] || `M${item._id}`}</span>
                        <div className="flex items-center gap-2 flex-1 justify-end">
                          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                            <CheckCircle className="h-3 w-3" />{item.completed}
                          </span>
                          <span className="text-gray-300">/</span>
                          <span className="flex items-center gap-1 text-red-400 font-semibold">
                            <XCircle className="h-3 w-3" />{item.cancelled}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
              <ActivityIcon className="h-4 w-4 text-violet-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="space-y-1">
            {activities.length === 0
              ? <p className="text-sm text-gray-400 py-4 text-center">No recent activity</p>
              : activities.map((a) => {
                  const act = activityLabel[a.type] || { label: a.type, color: 'bg-gray-100 text-gray-500' };
                  return (
                    <div key={a.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold overflow-hidden shrink-0 ${act.color}`}>
                        {a.avatar
                          ? <img src={getImageUrl(a.avatar)} alt={a.user} className="w-full h-full object-cover" />
                          : a.user?.charAt(0)?.toUpperCase() || 'A'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 leading-snug">
                          <span className="font-semibold">{a.user}</span>{' '}
                          <span className="text-gray-500">{act.label}</span>
                          {a.trail && <span className="text-gray-400"> · {a.trail}</span>}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{timeAgo(a.time)}</p>
                      </div>
                    </div>
                  );
                })
            }
          </div>
        </Card>
      </div>
    </div>
  );
}
