'use client';

import { useEffect, useState } from 'react';
import { trailService } from '@/services/trail.service';
import { Trail } from '@/types';
import TrailCard from '@/components/trails/TrailCard';
import TrailFilters from '@/components/trails/TrailFilters';
import SearchBar from '@/components/ui/SearchBar';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import { Mountain, MapPin, TrendingUp, Filter } from 'lucide-react';

export default function TrailsPage() {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [filtered, setFiltered] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 9;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await trailService.getAll({ limit: 1000 });
        const data = res.data?.trails || res.data || [];
        setTrails(data);
        setFiltered(data);
      } catch { /* ignore */ }
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    let result = trails;
    if (search) result = result.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
    if (difficulty) result = result.filter(t => t.difficulty === difficulty);
    setFiltered(result);
    setPage(1);
  }, [search, difficulty, trails]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const easy     = trails.filter(t => t.difficulty === 'Easy').length;
  const moderate = trails.filter(t => t.difficulty === 'Moderate').length;
  const hard     = trails.filter(t => t.difficulty === 'Hard').length;

  if (loading) return (
    <div className="space-y-6">
      <div className="h-36 bg-gray-200 rounded-2xl animate-pulse" />
      <div className="flex gap-3">
        {[...Array(4)].map((_, i) => <div key={i} className="h-10 w-24 bg-gray-100 rounded-xl animate-pulse" />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-52 bg-gray-200 rounded-t-2xl" />
            <div className="p-5 space-y-3 border border-gray-100 rounded-b-2xl">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeInUp">

      {/* ── Header ── */}
      <div className="relative bg-linear-to-br from-emerald-600 to-teal-500 rounded-2xl p-6 text-white overflow-hidden shadow-xl shadow-emerald-500/20">
        <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-teal-300/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-medium text-emerald-100 mb-3">
            <Mountain className="h-3.5 w-3.5" /> Nepal Trails
          </div>
          <h1 className="text-2xl font-bold">Explore Trails</h1>
          <p className="text-emerald-100 text-sm mt-1">{trails.length} trails — discover your next adventure</p>
        </div>
      </div>

      {/* ── Stat chips ── */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Total',    value: trails.length, icon: Mountain,   color: 'text-emerald-600' },
          { label: 'Easy',     value: easy,           icon: MapPin,     color: 'text-green-500' },
          { label: 'Moderate', value: moderate,       icon: TrendingUp, color: 'text-amber-500' },
          { label: 'Hard',     value: hard,           icon: TrendingUp, color: 'text-red-500' },
        ].map(s => (
          <button
            key={s.label}
            onClick={() => setDifficulty(s.label === 'Total' ? '' : s.label)}
            className={`flex items-center gap-2 px-4 py-2 bg-white rounded-xl border shadow-sm text-sm transition-all hover:shadow-md ${
              (s.label === 'Total' && !difficulty) || difficulty === s.label
                ? 'border-emerald-200 bg-emerald-50'
                : 'border-gray-100'
            }`}
          >
            <s.icon className={`h-4 w-4 ${s.color}`} />
            <span className="font-semibold text-gray-900">{s.value}</span>
            <span className="text-gray-400">{s.label}</span>
          </button>
        ))}
      </div>

      {/* ── Search & Filter ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar onSearch={setSearch} placeholder="Search trails by name..." />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400 shrink-0" />
          <TrailFilters difficulty={difficulty} onDifficultyChange={setDifficulty} />
        </div>
      </div>

      {/* ── Results count ── */}
      <p className="text-sm text-gray-400 font-medium">
        {filtered.length} trail{filtered.length !== 1 ? 's' : ''} found
        {(search || difficulty) && <span className="ml-1 text-emerald-600">· filtered</span>}
      </p>

      {/* ── Grid ── */}
      {paginated.length === 0 ? (
        <EmptyState
          title="No trails found"
          description="Try adjusting your search or filters"
          icon={<Mountain className="h-8 w-8 text-gray-300" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((trail, i) => (
            <div key={trail._id} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.05}s` }}>
              <TrailCard trail={trail} />
            </div>
          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} perPage={perPage} />
    </div>
  );
}
