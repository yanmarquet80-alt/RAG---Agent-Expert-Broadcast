'use client';

import { useState } from 'react';
import { Source } from '@/lib/types';

interface SourceCardProps {
  sources: Source[];
}

export function SourceCard({ sources }: SourceCardProps) {
  const [open, setOpen] = useState(false);

  if (!sources?.length) return null;

  return (
    <div className="mt-3 border border-[#30363D] rounded-md overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2 bg-[#161B22] text-xs text-[#8B949E] hover:bg-[#21262D] transition-colors"
      >
        <span className="font-medium text-[#58A6FF]">
          {sources.length} source{sources.length > 1 ? 's' : ''} consultée{sources.length > 1 ? 's' : ''}
        </span>
        <span>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="divide-y divide-[#30363D]">
          {sources.map((src, i) => (
            <div key={i} className="px-3 py-2 bg-[#0D1117]">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                {src.metadata.original_name && (
                  <span className="text-xs font-mono text-[#58A6FF]">
                    {src.metadata.original_name}
                  </span>
                )}
                {src.metadata.device_model && (
                  <span className="text-xs bg-[#21262D] text-[#C9D1D9] px-2 py-0.5 rounded">
                    {src.metadata.device_model}
                  </span>
                )}
                {src.metadata.category && (
                  <span className="text-xs bg-[#1C2128] text-[#8B949E] px-2 py-0.5 rounded border border-[#30363D]">
                    {src.metadata.category}
                  </span>
                )}
                {src.metadata.loc?.pageNumber && (
                  <span className="text-xs text-[#8B949E]">p. {src.metadata.loc.pageNumber}</span>
                )}
              </div>
              <p className="text-xs text-[#6E7681] line-clamp-3 font-mono leading-relaxed">
                {src.pageContent}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
