'use client';

import { useEffect, useState } from 'react';
import { stepService } from '@/services/step.service';
import { trailService } from '@/services/trail.service';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import { Footprints, TrendingUp, Target, Award, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { Trail } from '@/types';

export default function StepsPage() {
  const { user } = useAuth();
  const [total, setTotal] = useState(0);
  const [steps, setSteps] = useState('');
  const [selectedTrail, setSelectedTrail] = useState('');
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const goal = 10000;

  useEffect(() => {
    const loadData = async () => {
      try {
        const trailsRes = await trailService.getAll();
        setTrails(trailsRes.data?.trails || trailsRes.data || []);
        if (user?._id) {
          try {
            const stepsRes = await stepService.getTotalForUser(user._id);
            setTotal(stepsRes.data?.totalSteps || stepsRes.totalSteps || 0);
          } catch { setTotal(0); }
        }
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    loadData();
  }, [user?._id]);

  const handleSave = async () => {
    const num = parseInt(steps);
    if (!num || num <= 0) { toast.error('Enter a valid step count'); return; }
    if (!user?._id) { toast.error('You must be logged in'); return; }
    if (!selectedTrail) { toast.error('Please select a trail'); return; }
    setSaving(true);
    try {
      await stepService.save({ userId: user._id, trailId: selectedTrail, steps: num });
      setTotal(prev => prev + num);
      setSteps('');
      toast.success(`${num.toLocaleString()} steps logged!`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save steps');
    }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  const progress    = Math.min((total / goal) * 100, 100);
  const circumference = 2 * Math.PI * 42;
  const strokeDash  = circumference - (progress / 100) * circumference;
  const distanceKm  = (total / 1000).toFixed(1);
  const remaining   = Math.max(goal - total, 0);

  const selectClass = 'w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all';

  return (
    <div className="space-y-5 animate-fadeInUp max-w-2xl mx-auto">

      {/* ── Header ── */}
      <div className="relative bg-linear-to-br from-orange-500 to-amber-500 rounded-2xl p-6 text-white overflow-hidden shadow-xl shadow-orange-500/20">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-medium text-orange-100 mb-3">
            <Footprints className="h-3.5 w-3.5" /> Daily Tracker
          </div>
          <h1 className="text-2xl font-bold">Step Tracker</h1>
          <p className="text-orange-100 text-sm mt-1">Track your trekking steps and stay active</p>
        </div>
      </div>

      {/* ── Ring + Stats ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">

          {/* SVG Ring */}
          <div className="relative shrink-0">
            <svg viewBox="0 0 100 100" className="w-36 h-36 -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#fed7aa" strokeWidth="9" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke="url(#stepGrad)" strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDash}
                className="transition-all duration-700"
              />
              <defs>
                <linearGradient id="stepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
              <span className="text-2xl font-bold text-gray-900">{progress.toFixed(0)}%</span>
              <span className="text-[11px] text-gray-400 font-medium">of goal</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 flex-1 w-full">
            {[
              { label: 'Total Steps',  value: total.toLocaleString(),    icon: Footprints, color: 'bg-orange-50 text-orange-500' },
              { label: 'Daily Goal',   value: goal.toLocaleString(),     icon: Target,     color: 'bg-emerald-50 text-emerald-500' },
              { label: 'Distance',     value: `${distanceKm} km`,        icon: TrendingUp, color: 'bg-blue-50 text-blue-500' },
              { label: 'Remaining',    value: remaining.toLocaleString(), icon: Award,      color: 'bg-amber-50 text-amber-500' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${s.color}`}>
                  <s.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{s.value}</p>
                  <p className="text-[11px] text-gray-400">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span>Progress toward {goal.toLocaleString()} steps</span>
            <span className="font-semibold text-orange-500">{progress.toFixed(0)}%</span>
          </div>
          <div className="h-2.5 bg-orange-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          {progress >= 100 && (
            <p className="text-xs text-emerald-600 font-semibold mt-2">🎉 Daily goal reached! Great job!</p>
          )}
        </div>
      </div>

      {/* ── Log Steps ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
            <Plus className="h-4 w-4 text-orange-500" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Log Steps</h2>
            <p className="text-xs text-gray-400">Select a trail and enter your step count</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Trail</label>
            <select
              value={selectedTrail}
              onChange={e => setSelectedTrail(e.target.value)}
              className={selectClass}
            >
              <option value="">Choose a trail...</option>
              {trails.map(trail => (
                <option key={trail._id} value={trail._id}>
                  {trail.name} — {trail.difficulty}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Steps Count</label>
            <Input
              type="number"
              value={steps}
              onChange={e => setSteps(e.target.value)}
              placeholder="e.g. 5000"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-linear-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold shadow-lg shadow-orange-500/25 hover:opacity-90 transition-all disabled:opacity-60"
          >
            <TrendingUp className="h-4 w-4" />
            {saving ? 'Logging...' : 'Log Steps'}
          </button>
        </div>
      </div>
    </div>
  );
}
