'use client';

import { useState, useEffect, useCallback } from 'react';
import { checklistService } from '@/services/checklist.service';
import { ChecklistItem } from '@/types';
import Select from '@/components/ui/Select';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import { CheckSquare, Square, Sparkles, RotateCcw, Save, PackageCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const categoryColors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Essentials: { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-100',   dot: 'bg-blue-500' },
  Clothing:   { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-100', dot: 'bg-violet-500' },
  Gear:       { bg: 'bg-emerald-50',text: 'text-emerald-700',border: 'border-emerald-100',dot: 'bg-emerald-500' },
  Food:       { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-100',  dot: 'bg-amber-500' },
  Safety:     { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-100',    dot: 'bg-red-500' },
  General:    { bg: 'bg-gray-50',   text: 'text-gray-600',   border: 'border-gray-100',   dot: 'bg-gray-400' },
};

export default function ChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [experience, setExperience] = useState('beginner');
  const [duration, setDuration] = useState('day');
  const [weather, setWeather] = useState('sunny');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await checklistService.getMyChecklist();
        const saved = res.data;
        if (saved?.items?.length > 0) {
          setItems(saved.items);
          if (saved.config) {
            setExperience(saved.config.experience || 'beginner');
            setDuration(saved.config.duration || 'day');
            setWeather(saved.config.weather || 'sunny');
          }
        }
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const saveChecklist = useCallback(async (itemsToSave: ChecklistItem[]) => {
    if (itemsToSave.length === 0) return;
    try {
      await checklistService.saveChecklist({ items: itemsToSave, config: { experience, duration, weather } });
    } catch { /* ignore */ }
  }, [experience, duration, weather]);

  const generate = async () => {
    setGenerating(true);
    try {
      const res = await checklistService.generate({ experience, duration, weather });
      const data = res.data || res;
      const checklistItems: ChecklistItem[] = [];

      if (typeof data === 'object' && !Array.isArray(data)) {
        Object.entries(data).forEach(([category, categoryItems]) => {
          if (Array.isArray(categoryItems)) {
            categoryItems.forEach((item: any) => {
              checklistItems.push({
                _id: String(item.id || Math.random()),
                name: item.text || item.name || 'Unknown Item',
                checked: item.checked || false,
                category: category.charAt(0).toUpperCase() + category.slice(1),
              });
            });
          }
        });
      } else if (Array.isArray(data)) {
        data.forEach((item: any, i: number) => {
          checklistItems.push({
            _id: item._id || String(i),
            name: item.text || item.name || 'Unknown Item',
            checked: item.checked || false,
            category: item.category || 'General',
          });
        });
      }

      setItems(checklistItems);
      await saveChecklist(checklistItems);
      if (checklistItems.length > 0) toast.success(`Generated ${checklistItems.length} items!`);
    } catch {
      toast.error('Failed to generate checklist');
    }
    setGenerating(false);
  };

  const toggle = async (index: number) => {
    const newItems = items.map((item, i) => i === index ? { ...item, checked: !item.checked } : item);
    setItems(newItems);
    await saveChecklist(newItems);
  };

  const resetChecklist = async () => {
    const newItems = items.map(item => ({ ...item, checked: false }));
    setItems(newItems);
    await saveChecklist(newItems);
    toast.success('Checklist reset!');
  };

  const handleManualSave = async () => {
    setSaving(true);
    try {
      await saveChecklist(items);
      toast.success('Checklist saved!');
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  const checkedCount = items.filter(i => i.checked).length;
  const progress     = items.length > 0 ? Math.round((checkedCount / items.length) * 100) : 0;
  const categories   = [...new Set(items.map(i => i.category || 'General'))];

  return (
    <div className="space-y-5 animate-fadeInUp">

      {/* ── Header ── */}
      <div className="relative bg-linear-to-br from-purple-600 to-violet-500 rounded-2xl p-6 text-white overflow-hidden shadow-xl shadow-purple-500/20">
        <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-medium text-purple-100 mb-3">
            <Sparkles className="h-3.5 w-3.5" /> AI-Powered
          </div>
          <h1 className="text-2xl font-bold">Trekking Checklist</h1>
          <p className="text-purple-100 text-sm mt-1">Personalized packing list generated by AI</p>
        </div>
      </div>

      {/* ── Configure ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Configure Your Trek</h2>
            <p className="text-xs text-gray-400">Set your experience, duration, and weather</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Experience Level"
              value={experience}
              onChange={e => setExperience(e.target.value)}
              options={[
                { value: 'beginner',     label: '🌱 Beginner' },
                { value: 'intermediate', label: '🥾 Intermediate' },
                { value: 'advanced',     label: '🏔️ Advanced' },
              ]}
            />
            <Select
              label="Trek Duration"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              options={[
                { value: 'day',       label: '☀️ Day Trek' },
                { value: 'overnight', label: '🌙 Overnight' },
                { value: 'multi-day', label: '🏕️ Multi-Day' },
              ]}
            />
            <Select
              label="Weather"
              value={weather}
              onChange={e => setWeather(e.target.value)}
              options={[
                { value: 'sunny', label: '☀️ Sunny' },
                { value: 'hot',   label: '🔥 Hot' },
                { value: 'cold',  label: '❄️ Cold' },
                { value: 'rainy', label: '🌧️ Rainy' },
              ]}
            />
          </div>
          <button
            onClick={generate}
            disabled={generating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-violet-500 text-white text-sm font-semibold shadow-md shadow-purple-500/25 hover:opacity-90 transition-all disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4" />
            {generating ? 'Generating...' : 'Generate Checklist'}
          </button>
        </div>
      </div>

      {generating && <div className="flex justify-center py-10"><Spinner size="lg" /></div>}

      {!generating && items.length === 0 && (
        <EmptyState
          title="No checklist yet"
          description="Configure your trek above and click Generate to create your personalized packing list"
          icon={<CheckSquare className="h-8 w-8 text-gray-300" />}
        />
      )}

      {!generating && items.length > 0 && (
        <>
          {/* ── Progress ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <PackageCheck className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-semibold text-gray-900">Packing Progress</span>
              </div>
              <span className="text-sm font-bold text-purple-600">{checkedCount} / {items.length} packed</span>
            </div>
            <div className="h-3 bg-purple-50 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-purple-500 to-violet-400 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-400">{progress}% complete</span>
              {progress === 100 && (
                <span className="text-xs text-emerald-600 font-semibold">✅ All packed! Ready to go!</span>
              )}
            </div>
          </div>

          {/* ── Action buttons ── */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={resetChecklist}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset All
            </button>
            <button
              onClick={handleManualSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-60"
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>

          {/* ── Category cards ── */}
          <div className="space-y-4">
            {categories.map(cat => {
              const catItems   = items.filter(i => (i.category || 'General') === cat);
              const catChecked = catItems.filter(i => i.checked).length;
              const catColors  = categoryColors[cat] || categoryColors.General;
              return (
                <div key={cat} className={`bg-white rounded-2xl border ${catColors.border} shadow-sm overflow-hidden`}>
                  <div className={`flex items-center justify-between px-5 py-3.5 ${catColors.bg} border-b ${catColors.border}`}>
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${catColors.dot}`} />
                      <h3 className={`text-sm font-semibold ${catColors.text}`}>{cat}</h3>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${catColors.bg} ${catColors.text} border ${catColors.border}`}>
                      {catChecked}/{catItems.length}
                    </span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {catItems.map(item => {
                      const globalIdx = items.indexOf(item);
                      return (
                        <button
                          key={item._id}
                          onClick={() => toggle(globalIdx)}
                          className="flex items-center gap-3 w-full px-5 py-3 hover:bg-gray-50/60 transition-colors text-left group"
                        >
                          {item.checked ? (
                            <CheckSquare className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                          ) : (
                            <Square className="h-4.5 w-4.5 text-gray-300 group-hover:text-gray-400 shrink-0" />
                          )}
                          <span className={`text-sm ${item.checked ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                            {item.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
