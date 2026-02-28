'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { groupService } from '@/services/group.service';
import { trailService } from '@/services/trail.service';
import { Trail } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import { ArrowLeft, Users, Mountain, MapPin, Image, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateGroupPage() {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: '', description: '', trail: '', date: '',
    maxSize: '10', meetingPoint: '', requirements: ''
  });

  useEffect(() => {
    if (user && user.role !== 'admin' && user.role !== 'guide') {
      toast.error('Only guides and admins can create groups');
      router.push('/groups');
      return;
    }
    trailService.getAll().then(res => setTrails(res.data?.trails || res.data || [])).catch(() => {});
  }, [user, router]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 10) { toast.error('Maximum 10 photos allowed'); return; }
    setPhotos(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreviews(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Group title is required'); return; }
    if (!form.date) { toast.error('Date is required'); return; }
    if (!form.trail) { toast.error('Please select a trail'); return; }
    if (!user?._id) { toast.error('You must be logged in'); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('trail', form.trail);
      formData.append('date', form.date);
      formData.append('maxSize', form.maxSize);
      formData.append('leader', user._id);
      if (form.meetingPoint) formData.append('meetingPoint', JSON.stringify({ description: form.meetingPoint }));
      if (form.requirements) formData.append('requirements', JSON.stringify(form.requirements.split(',').map(r => r.trim())));
      photos.forEach(photo => formData.append('photo', photo));
      await groupService.create(formData);
      toast.success('Group created!');
      router.push('/groups');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to create group');
    }
    setLoading(false);
  };

  const fieldClass = 'w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all';

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fadeInUp">

      {/* ── Back button ── */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to groups
      </button>

      {/* ── Header banner ── */}
      <div className="relative bg-linear-to-br from-violet-600 to-purple-500 rounded-2xl p-6 text-white overflow-hidden shadow-xl shadow-violet-500/20">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/20 border border-white/20 flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Create a Group</h1>
            <p className="text-violet-100 text-sm mt-0.5">Start a trekking group and invite others to join</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* ── Basic Info ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
              <Users className="h-4 w-4 text-violet-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Basic Information</h2>
          </div>
          <div className="p-5 space-y-4">
            <Input
              label="Group Title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., Weekend Trekkers"
              required
            />
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Tell others about your group, plans, and what to expect..."
                rows={3}
                className={`${fieldClass} resize-none`}
              />
            </div>
          </div>
        </div>

        {/* ── Trek Details ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Mountain className="h-4 w-4 text-emerald-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Trek Details</h2>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Trail</label>
              <select value={form.trail} onChange={e => setForm({ ...form, trail: e.target.value })} className={fieldClass} required>
                <option value="">Select a trail...</option>
                {trails.map(t => (
                  <option key={t._id} value={t._id}>{t.name} — {t.difficulty}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Date & Time</label>
                <input type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className={fieldClass} required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Max Members</label>
                <input type="number" value={form.maxSize} onChange={e => setForm({ ...form, maxSize: e.target.value })} min="2" max="20" className={fieldClass} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Meeting & Requirements ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-amber-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Meeting & Requirements</h2>
          </div>
          <div className="p-5 space-y-4">
            <Input
              label="Meeting Point"
              value={form.meetingPoint}
              onChange={e => setForm({ ...form, meetingPoint: e.target.value })}
              placeholder="e.g., Parking lot at trail entrance"
            />
            <Input
              label="Requirements (comma-separated)"
              value={form.requirements}
              onChange={e => setForm({ ...form, requirements: e.target.value })}
              placeholder="e.g., Water bottle, Trekking boots, Rain jacket"
            />
          </div>
        </div>

        {/* ── Photos ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Image className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Group Photos</h2>
              <p className="text-xs text-gray-400">Optional · max 10 photos</p>
            </div>
          </div>
          <div className="p-5">
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handlePhotoChange} className="hidden" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center gap-2 py-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-violet-400 hover:bg-violet-50/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-violet-100 flex items-center justify-center transition-colors">
                <Upload className="h-5 w-5 text-gray-400 group-hover:text-violet-600 transition-colors" />
              </div>
              <span className="text-sm text-gray-500 group-hover:text-violet-600 font-medium transition-colors">Click to upload photos</span>
              <span className="text-xs text-gray-400">PNG, JPG up to 5MB each</span>
            </button>

            {photoPreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {photoPreviews.map((preview, i) => (
                  <div key={i} className="relative group aspect-square">
                    <img src={preview} alt={`Preview ${i + 1}`} className="w-full h-full object-cover rounded-xl" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Submit ── */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-linear-to-r from-violet-600 to-purple-500 text-white text-sm font-semibold shadow-lg shadow-violet-500/25 hover:opacity-90 transition-all disabled:opacity-60"
        >
          <Users className="h-4 w-4" />
          {loading ? 'Creating...' : 'Create Group'}
        </button>
      </form>
    </div>
  );
}
