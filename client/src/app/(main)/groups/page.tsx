'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { groupService } from '@/services/group.service';
import { useAuth } from '@/hooks/useAuth';
import { Group } from '@/types';
import GroupCard from '@/components/groups/GroupCard';
import SearchBar from '@/components/ui/SearchBar';
import Pagination from '@/components/ui/Pagination';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import { Users, Plus, Activity, CheckCircle, Clock } from 'lucide-react';

export default function GroupsPage() {
  const { user } = useAuth();
  const canCreateGroup = user?.role === 'admin' || user?.role === 'guide';
  const [groups, setGroups] = useState<Group[]>([]);
  const [filtered, setFiltered] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 9;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await groupService.getAll();
        const data = res.data?.groups || res.data || [];
        setGroups(data);
        setFiltered(data);
      } catch { /* ignore */ }
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    let result = groups;
    if (search) result = result.filter(g => g.title?.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter) result = result.filter(g => g.status === statusFilter);
    setFiltered(result);
    setPage(1);
  }, [search, statusFilter, groups]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage);

  const active    = groups.filter(g => g.status === 'active').length;
  const upcoming  = groups.filter(g => g.status === 'upcoming').length;
  const completed = groups.filter(g => g.status === 'completed').length;

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-fadeInUp">

      {/* ── Header ── */}
      <div className="relative bg-linear-to-br from-violet-600 to-purple-500 rounded-2xl p-6 text-white overflow-hidden shadow-xl shadow-violet-500/20">
        <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-medium text-violet-100 mb-3">
              <Users className="h-3.5 w-3.5" /> Community
            </div>
            <h1 className="text-2xl font-bold">Trekking Groups</h1>
            <p className="text-violet-100 text-sm mt-1">{groups.length} groups — find your trekking community</p>
          </div>
          {canCreateGroup && (
            <Link
              href="/groups/create"
              className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 border border-white/20 rounded-xl text-sm font-semibold transition-colors shrink-0"
            >
              <Plus className="h-4 w-4" /> Create Group
            </Link>
          )}
        </div>
      </div>

      {/* ── Stat chips ── */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'All',       value: groups.length, icon: Users,       color: 'text-violet-600', status: '' },
          { label: 'Active',    value: active,         icon: Activity,    color: 'text-emerald-600', status: 'active' },
          { label: 'Upcoming',  value: upcoming,       icon: Clock,       color: 'text-blue-500',   status: 'upcoming' },
          { label: 'Completed', value: completed,      icon: CheckCircle, color: 'text-gray-400',   status: 'completed' },
        ].map(s => (
          <button
            key={s.label}
            onClick={() => setStatusFilter(s.status)}
            className={`flex items-center gap-2 px-4 py-2 bg-white rounded-xl border shadow-sm text-sm transition-all hover:shadow-md ${
              statusFilter === s.status
                ? 'border-violet-200 bg-violet-50'
                : 'border-gray-100'
            }`}
          >
            <s.icon className={`h-4 w-4 ${s.color}`} />
            <span className="font-semibold text-gray-900">{s.value}</span>
            <span className="text-gray-400">{s.label}</span>
          </button>
        ))}
      </div>

      {/* ── Search ── */}
      <SearchBar onSearch={setSearch} placeholder="Search groups..." />

      {/* ── Results count ── */}
      {(search || statusFilter) && (
        <p className="text-sm text-gray-400 font-medium">
          {filtered.length} group{filtered.length !== 1 ? 's' : ''} found
          <span className="ml-1 text-violet-600">· filtered</span>
        </p>
      )}

      {/* ── Grid ── */}
      {paginated.length === 0 ? (
        <EmptyState
          title="No groups found"
          description={canCreateGroup ? 'Create one or try a different search' : 'Try a different search'}
          icon={<Users className="h-8 w-8 text-gray-300" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((group, i) => (
            <div key={group._id} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.05}s` }}>
              <GroupCard group={group} />
            </div>
          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} perPage={perPage} />
    </div>
  );
}
