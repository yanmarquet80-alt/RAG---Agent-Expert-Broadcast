'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { RagDocument } from '@/lib/types';

const CATEGORY_COLORS: Record<string, string> = {
  mixer:    'bg-blue-900/40 text-blue-300 border-blue-800',
  encoder:  'bg-purple-900/40 text-purple-300 border-purple-800',
  protocol: 'bg-green-900/40 text-green-300 border-green-800',
  cable:    'bg-yellow-900/40 text-yellow-300 border-yellow-800',
  software: 'bg-orange-900/40 text-orange-300 border-orange-800',
};

export function DocumentList() {
  const [docs, setDocs] = useState<RagDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('rag_documents')
      .select('*')
      .eq('status', 'indexed')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setDocs(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <aside className="w-64 border-r border-[#30363D] bg-[#161B22] flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-[#30363D]">
        <h2 className="text-xs font-semibold text-[#8B949E] uppercase tracking-wider">
          Documentation indexée
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="px-4 py-6 text-xs text-[#6E7681]">Chargement...</div>
        )}
        {!loading && docs.length === 0 && (
          <div className="px-4 py-6 text-xs text-[#6E7681]">
            Aucun document indexé.<br />
            Uploadez un PDF via le formulaire n8n.
          </div>
        )}
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="px-4 py-3 border-b border-[#21262D] hover:bg-[#21262D] transition-colors"
          >
            <p className="text-xs text-[#C9D1D9] font-mono leading-tight truncate" title={doc.original_name}>
              {doc.original_name}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              {doc.category && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${CATEGORY_COLORS[doc.category] ?? 'bg-[#21262D] text-[#8B949E] border-[#30363D]'}`}>
                  {doc.category}
                </span>
              )}
              {doc.brand && (
                <span className="text-[10px] text-[#6E7681]">{doc.brand}</span>
              )}
            </div>
            {doc.device_model && (
              <p className="text-[10px] text-[#6E7681] mt-0.5">{doc.device_model}</p>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
