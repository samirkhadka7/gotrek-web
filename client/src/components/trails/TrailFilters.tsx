'use client';

import Select from '@/components/ui/Select';

interface TrailFiltersProps { difficulty: string; onDifficultyChange: (val: string) => void; }

export default function TrailFilters({ difficulty, onDifficultyChange }: TrailFiltersProps) {
  return (
    <div className="flex items-center gap-3">
      <Select label="" value={difficulty} onChange={(e) => onDifficultyChange(e.target.value)}
        options={[
          { value: '', label: 'All Difficulties' },
          { value: 'Easy', label: 'Easy' },
          { value: 'Moderate', label: 'Moderate' },
          { value: 'Hard', label: 'Hard' },
        ]} />
    </div>
  );
}
