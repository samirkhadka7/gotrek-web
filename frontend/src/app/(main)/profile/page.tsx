'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import Input from '@/components/ui/Input';
import {
  Camera, Save, Shield, Award, BadgeCheck,
  User, AlertTriangle, Mountain, Pencil
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadTimestamp, setUploadTimestamp] = useState(0);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    hikerType: user?.hikerType || '',
    ageGroup: user?.ageGroup || '',
    bio: user?.bio || '',
    emergencyContact: {
      name: user?.emergencyContact?.name || '',
      phone: user?.emergencyContact?.phone || ''
    },
    guideProfile: {
      experienceYears: user?.guideProfile?.experienceYears || 0,
      specialization: user?.guideProfile?.specialization?.join(', ') || '',
      languages: user?.guideProfile?.languages?.join(', ') || '',
      certifications: user?.guideProfile?.certifications?.join(', ') || '',
    }
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        hikerType: user.hikerType || '',
        ageGroup: user.ageGroup || '',
        bio: user.bio || '',
        emergencyContact: {
          name: user.emergencyContact?.name || '',
          phone: user.emergencyContact?.phone || ''
        },
        guideProfile: {
          experienceYears: user.guideProfile?.experienceYears || 0,
          specialization: user.guideProfile?.specialization?.join(', ') || '',
          languages: user.guideProfile?.languages?.join(', ') || '',
          certifications: user.guideProfile?.certifications?.join(', ') || '',
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (user?.profileImage) {
      let url = user.profileImage;
      if (!url.startsWith('http')) {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5050';
        url = `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
      }
      const cacheBuster = uploadTimestamp > 0 ? `?t=${uploadTimestamp}` : `?t=${Date.now()}`;
      url = url + cacheBuster;
      setImageUrl(url);
    }
  }, [user?.profileImage, uploadTimestamp]);

  const handleUpdate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: any = { ...form };
      if (user?.role === 'guide') {
        payload.guideProfile = {
          experienceYears: Number(form.guideProfile.experienceYears) || 0,
          specialization: form.guideProfile.specialization.split(',').map((s: string) => s.trim()).filter(Boolean),
          languages: form.guideProfile.languages.split(',').map((s: string) => s.trim()).filter(Boolean),
          certifications: form.guideProfile.certifications.split(',').map((s: string) => s.trim()).filter(Boolean),
        };
      } else {
        delete payload.guideProfile;
      }
      await api.put('/user/me', payload);
      await refreshUser();
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); }
    setLoading(false);
  };

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const fd = new FormData();
    fd.append('profileImage', e.target.files[0]);
    try {
      const response = await api.put('/user/me/picture', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const userData = response.data.data || response.data.user || response.data;
      if (userData?.profileImage) setUploadTimestamp(Date.now());
      if (fileRef.current) fileRef.current.value = '';
      await refreshUser();
      toast.success('Photo updated!');
    } catch {
      toast.error('Upload failed');
    }
  };

  const selectClass = 'w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all';

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fadeInUp">

      {/* ── Hero Card ── */}
      <div className="relative bg-linear-to-br from-violet-600 to-purple-600 rounded-2xl overflow-hidden shadow-xl shadow-violet-500/20">
        <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative px-6 pt-6 pb-8 flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative group mb-4">
            <div className="w-24 h-24 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-white text-3xl font-bold overflow-hidden shadow-lg">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                user?.name?.charAt(0)?.toUpperCase() || 'U'
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera className="h-5 w-5 text-white" />
            </button>
            <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-md pointer-events-none">
              <Pencil className="h-3.5 w-3.5 text-violet-600" />
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
          </div>

          <h1 className="text-xl font-bold text-white">{user?.name || 'Your Name'}</h1>
          <p className="text-violet-200 text-sm mt-0.5">{user?.email}</p>

          {/* Role & Plan badges */}
          <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
            {user?.role === 'guide' ? (
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${user.guideProfile?.verified ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-100' : 'bg-amber-500/20 border-amber-400/40 text-amber-100'}`}>
                <BadgeCheck className="h-3 w-3" />
                {user.guideProfile?.verified ? 'Verified Guide' : 'Guide'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 border border-white/20 text-white">
                <Shield className="h-3 w-3" />
                {user?.role}
              </span>
            )}
            {user?.subscription && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/20 border border-amber-300/40 text-amber-100">
                <Award className="h-3 w-3" />
                {user.subscription}
              </span>
            )}
          </div>
        </div>

        {/* Quick info strip */}
        <div className="relative grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-black/10">
          <div className="flex flex-col items-center py-3 gap-0.5">
            <span className="text-lg font-bold text-white">{user?.completedTrails?.length || 0}</span>
            <span className="text-[11px] text-violet-200">Trails Done</span>
          </div>
          <div className="flex flex-col items-center py-3 gap-0.5">
            <span className="text-lg font-bold text-white capitalize">{user?.hikerType || '—'}</span>
            <span className="text-[11px] text-violet-200">Trekker Type</span>
          </div>
          <div className="flex flex-col items-center py-3 gap-0.5">
            <span className="text-lg font-bold text-white">{user?.ageGroup || '—'}</span>
            <span className="text-[11px] text-violet-200">Age Group</span>
          </div>
        </div>
      </div>

      {/* ── Personal Info ── */}
      <form onSubmit={handleUpdate} className="space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
              <User className="h-4 w-4 text-violet-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Personal Information</h2>
          </div>
          <div className="p-5 space-y-4">
            <Input label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className={selectClass}
                  placeholder="+977 98XXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Age Group</label>
                <select value={form.ageGroup} onChange={e => setForm({ ...form, ageGroup: e.target.value })} className={selectClass}>
                  <option value="">Select</option>
                  <option value="18-24">18–24</option>
                  <option value="24-35">24–35</option>
                  <option value="35-44">35–44</option>
                  <option value="45-54">45–54</option>
                  <option value="55-64">55–64</option>
                  <option value="65+">65+</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Trekker Type</label>
              <select value={form.hikerType} onChange={e => setForm({ ...form, hikerType: e.target.value })} className={selectClass}>
                <option value="">Select trekker type</option>
                <option value="new">New Trekker</option>
                <option value="experienced">Experienced Trekker</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Bio</label>
              <textarea
                value={form.bio}
                onChange={e => setForm({ ...form, bio: e.target.value })}
                rows={3}
                placeholder="Tell us about your trekking journey..."
                className={`${selectClass} resize-none`}
              />
            </div>
          </div>
        </div>

        {/* ── Emergency Contact ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Emergency Contact</h2>
              <p className="text-xs text-gray-400">In case of trail emergency</p>
            </div>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4">
            <Input
              label="Contact Name"
              value={form.emergencyContact.name}
              onChange={e => setForm({ ...form, emergencyContact: { ...form.emergencyContact, name: e.target.value } })}
            />
            <Input
              label="Contact Phone"
              value={form.emergencyContact.phone}
              onChange={e => setForm({ ...form, emergencyContact: { ...form.emergencyContact, phone: e.target.value } })}
            />
          </div>
        </div>

        {/* ── Guide Profile ── */}
        {user?.role === 'guide' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <BadgeCheck className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Guide Profile</h2>
                  <p className="text-xs text-gray-400">Your professional information</p>
                </div>
              </div>
              {user.guideProfile?.verified && (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                  ✓ Verified
                </span>
              )}
            </div>
            <div className="p-5 space-y-4">
              <Input
                label="Experience Years"
                type="number"
                value={String(form.guideProfile.experienceYears)}
                onChange={e => setForm({ ...form, guideProfile: { ...form.guideProfile, experienceYears: Number(e.target.value) } })}
              />
              <Input
                label="Specialization (comma-separated)"
                value={form.guideProfile.specialization}
                onChange={e => setForm({ ...form, guideProfile: { ...form.guideProfile, specialization: e.target.value } })}
                placeholder="e.g., Everest Region, Annapurna Region"
              />
              <Input
                label="Languages (comma-separated)"
                value={form.guideProfile.languages}
                onChange={e => setForm({ ...form, guideProfile: { ...form.guideProfile, languages: e.target.value } })}
                placeholder="e.g., English, Nepali, Hindi"
              />
              <Input
                label="Certifications (comma-separated)"
                value={form.guideProfile.certifications}
                onChange={e => setForm({ ...form, guideProfile: { ...form.guideProfile, certifications: e.target.value } })}
                placeholder="e.g., NMA Certified, First Aid"
              />
            </div>
          </div>
        )}

        {/* ── Save Button ── */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-linear-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:opacity-90 transition-all disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* ── Completed Trails ── */}
      {user?.completedTrails && user.completedTrails.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Mountain className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Completed Trails</h2>
              <p className="text-xs text-gray-400">{user.completedTrails.length} trails conquered</p>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {user.completedTrails.map((ct, i) => {
              const trail = typeof ct.trail === 'object' ? ct.trail : null;
              return (
                <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <Mountain className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{trail?.name || 'Trail'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Completed · {new Date(ct.completedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                    <Award className="h-3 w-3" /> Done
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
