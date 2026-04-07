'use client';

import { FilterCategory } from '@/lib/types';

const FILTERS: { label: string; value: FilterCategory }[] = [
  { label: 'Tous', value: 'all' },
  { label: 'Mélangeurs', value: 'mixer' },
  { label: 'Encodeurs', value: 'encoder' },
  { label: 'Protocoles', value: 'protocol' },
  { label: 'Câblage', value: 'cable' },
  { label: 'Logiciels', value: 'software' },
];

interface FilterBarProps {
  active: FilterCategory;
  onChange: (f: FilterCategory) => void;
}

export function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-[#30363D]">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            active === f.value
              ? 'bg-[#58A6FF] text-[#0D1117]'
              : 'bg-[#21262D] text-[#8B949E] hover:bg-[#30363D] hover:text-[#C9D1D9]'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
