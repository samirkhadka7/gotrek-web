'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { Group } from '@/types';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import { Trash2, Users, Eye, Edit, Plus, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
  upcoming: 'info', active: 'success', completed: 'default', cancelled: 'danger',
};

export default function AdminGroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const load = async () => {
    try {
      const res = await adminService.getGroups();
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.groups || []);
      setGroups(data);
    } catch { toast.error('Failed to load groups'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this group?')) return;
    try { await adminService.deleteGroup(id); toast.success('Group deleted'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  const totalPages = Math.ceil(groups.length / perPage);
  const paginated  = groups.slice((page - 1) * perPage, page * perPage);
  const active    = groups.filter(g => g.status === 'active').length;
  const upcoming  = groups.filter(g => g.status === 'upcoming').length;
  const completed = groups.filter(g => g.status === 'completed').length;

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-fadeInUp">

      {/* ── Header ── */}
      <div className="relative bg-linear-to-br from-violet-600 to-purple-500 rounded-2xl p-6 text-white overflow-hidden shadow-xl shadow-violet-500/20">
        <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Group Management</h1>
            <p className="text-violet-100 text-sm mt-1">{groups.length} groups — {active} active, {upcoming} upcoming</p>
          </div>
          <a href="/groups/create" className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 border border-white/20 rounded-xl text-sm font-semibold transition-colors shrink-0">
            <Plus className="h-4 w-4" /> Create Group
          </a>
        </div>
      </div>

      {/* ── Summary chips ── */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Total',     value: groups.length, color: 'text-violet-600' },
          { label: 'Active',    value: active,        color: 'text-emerald-600' },
          { label: 'Upcoming',  value: upcoming,      color: 'text-blue-600' },
          { label: 'Completed', value: completed,     color: 'text-gray-500' },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm text-sm">
            <Users className={`h-4 w-4 ${s.color}`} />
            <span className="font-semibold text-gray-900">{s.value}</span>
            <span className="text-gray-400">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Group</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Leader</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Members</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No groups found</td></tr>
              )}
              {paginated.map(g => {
                const leader = typeof g.leader === 'object' ? (g.leader as any)?.name : '—';
                return (
                  <tr key={g._id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                          <Users className="h-4 w-4 text-violet-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{g.title}</p>
                          <p className="text-xs text-gray-400">{g.difficulty || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{leader}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-gray-600">
                        <Users className="h-3.5 w-3.5 text-gray-400" />
                        {g.participants?.length || 0}
                        <span className="text-gray-400">/ {g.maxSize || '—'}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        {g.date ? new Date(g.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={statusVariant[g.status || ''] || 'default'}>{g.status || 'Active'}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a href={`/groups/${g._id}`} className="p-2 rounded-xl hover:bg-blue-50 transition-colors">
                          <Eye className="h-4 w-4 text-blue-500" />
                        </a>
                        <a href={`/groups/${g._id}/edit`} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                          <Edit className="h-4 w-4 text-gray-500" />
                        </a>
                        <button onClick={() => handleDelete(g._id)} className="p-2 rounded-xl hover:bg-red-50 transition-colors">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
