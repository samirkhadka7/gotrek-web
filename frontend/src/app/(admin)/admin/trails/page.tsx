'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminService } from '@/services/admin.service';
import { trailService } from '@/services/trail.service';
import { Trail } from '@/types';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import { Plus, Trash2, Star, Pencil, Mountain, MapPin, TrendingUp } from 'lucide-react';
import { getDifficultyColor } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminTrailsPage() {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const load = async () => {
    try {
      const res = await adminService.getTrails();
      setTrails(res.data || []);
    } catch { toast.error('Failed to load trails'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this trail?')) return;
    try { await trailService.delete(id); toast.success('Trail deleted'); load(); }
    catch { toast.error('Failed to delete trail'); }
  };

  const totalPages = Math.ceil(trails.length / perPage);
  const paginated  = trails.slice((page - 1) * perPage, page * perPage);

  const easy     = trails.filter(t => t.difficulty === 'Easy').length;
  const moderate = trails.filter(t => t.difficulty === 'Moderate').length;
  const hard     = trails.filter(t => t.difficulty === 'Hard').length;

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-fadeInUp">

      {/* ── Header ── */}
      <div className="relative bg-linear-to-br from-emerald-600 to-teal-500 rounded-2xl p-6 text-white overflow-hidden shadow-xl shadow-emerald-500/20">
        <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Trail Management</h1>
            <p className="text-emerald-100 text-sm mt-1">{trails.length} trails — {easy} easy, {moderate} moderate, {hard} hard</p>
          </div>
          <Link href="/admin/trails/create">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 border border-white/20 rounded-xl text-sm font-semibold transition-colors shrink-0">
              <Plus className="h-4 w-4" /> Add Trail
            </button>
          </Link>
        </div>
      </div>

      {/* ── Summary chips ── */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Total',    value: trails.length, icon: Mountain,    color: 'text-emerald-600' },
          { label: 'Easy',     value: easy,          icon: MapPin,      color: 'text-green-500' },
          { label: 'Moderate', value: moderate,      icon: TrendingUp,  color: 'text-amber-500' },
          { label: 'Hard',     value: hard,          icon: TrendingUp,  color: 'text-red-500' },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm text-sm">
            <s.icon className={`h-4 w-4 ${s.color}`} />
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
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Trail</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Difficulty</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Distance</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Elevation</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Rating</th>
                <th className="text-right px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No trails found</td></tr>
              )}
              {paginated.map(t => (
                <tr key={t._id} className="hover:bg-gray-50/60 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                        <Mountain className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{t.name}</p>
                        <p className="text-xs text-gray-400">{t.location || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={getDifficultyColor(t.difficulty) as 'success' | 'warning' | 'danger'}>{t.difficulty}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 font-medium">{t.distance} km</td>
                  <td className="px-5 py-3.5 text-gray-600">{t.elevation ? `${t.elevation} m` : '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 text-gray-600">
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      {t.averageRating ? t.averageRating.toFixed(1) : '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/trails/edit/${t._id}`}>
                        <button className="p-2 rounded-xl hover:bg-blue-50 transition-colors">
                          <Pencil className="h-4 w-4 text-blue-500" />
                        </button>
                      </Link>
                      <button onClick={() => handleDelete(t._id)} className="p-2 rounded-xl hover:bg-red-50 transition-colors">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
