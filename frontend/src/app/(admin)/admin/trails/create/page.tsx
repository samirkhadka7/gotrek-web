'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trailService } from '@/services/trail.service';
import Input from '@/components/ui/Input';
import FileUpload from '@/components/ui/FileUpload';
import { ArrowLeft, Mountain, MapPin, TrendingUp, Image } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateTrailPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', difficulty: 'Easy',
    distance: '', duration: '', elevation: '', location: ''
  });
  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Trail name is required'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach(img => fd.append('images', img));
      await trailService.create(fd);
      toast.success('Trail created!');
      router.push('/admin/trails');
    } catch { toast.error('Failed to create trail'); }
    setLoading(false);
  };

  const inputClass = 'w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all';

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fadeInUp">

      {/* ── Back button ── */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to trails
      </button>

      {/* ── Header banner ── */}
      <div className="relative bg-linear-to-br from-emerald-600 to-teal-500 rounded-2xl p-6 text-white overflow-hidden shadow-xl shadow-emerald-500/20">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/20 border border-white/20 flex items-center justify-center shrink-0">
            <Mountain className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Create Trail</h1>
            <p className="text-emerald-100 text-sm mt-0.5">Add a new trekking trail to the platform</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* ── Basic Info ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Mountain className="h-4 w-4 text-emerald-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Basic Information</h2>
          </div>
          <div className="p-5 space-y-4">
            <Input
              label="Trail Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Langtang Valley Trek"
              required
            />
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the trail experience, scenery, and highlights..."
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Difficulty</label>
              <select
                value={form.difficulty}
                onChange={e => setForm({ ...form, difficulty: e.target.value })}
                className={inputClass}
              >
                <option value="Easy">🟢 Easy</option>
                <option value="Moderate">🟡 Moderate</option>
                <option value="Hard">🔴 Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Trail Details ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Trail Details</h2>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Distance (km)"
                type="number"
                value={form.distance}
                onChange={e => setForm({ ...form, distance: e.target.value })}
                placeholder="e.g., 12"
              />
              <Input
                label="Duration"
                value={form.duration}
                onChange={e => setForm({ ...form, duration: e.target.value })}
                placeholder="e.g., 3-4 hrs"
              />
              <Input
                label="Elevation (m)"
                type="number"
                value={form.elevation}
                onChange={e => setForm({ ...form, elevation: e.target.value })}
                placeholder="e.g., 3500"
              />
            </div>
          </div>
        </div>

        {/* ── Location ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-amber-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Location</h2>
          </div>
          <div className="p-5">
            <Input
              label="Location"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              placeholder="e.g., Langtang, Nepal"
            />
          </div>
        </div>

        {/* ── Images ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
              <Image className="h-4 w-4 text-violet-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Trail Images</h2>
          </div>
          <div className="p-5">
            <FileUpload label="" accept="image/*" multiple onChange={setImages} />
          </div>
        </div>

        {/* ── Submit ── */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-500 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 hover:opacity-90 transition-all disabled:opacity-60"
        >
          <Mountain className="h-4 w-4" />
          {loading ? 'Creating...' : 'Create Trail'}
        </button>
      </form>
    </div>
  );
}
