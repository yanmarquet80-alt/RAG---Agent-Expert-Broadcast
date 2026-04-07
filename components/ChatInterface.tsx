'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, FilterCategory, Source } from '@/lib/types';
import { MessageBubble } from './MessageBubble';
import { FilterBar } from './FilterBar';

let sessionId = '';
if (typeof window !== 'undefined') {
  sessionId = sessionStorage.getItem('rag-session') ?? Date.now().toString();
  sessionStorage.setItem('rag-session', sessionId);
}

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<FilterCategory>('all');
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const body: Record<string, string> = { question, session_id: sessionId };
      if (filter !== 'all') body.filter_category = filter;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer ?? data.error ?? 'Aucune réponse reçue.',
        sources: (data.sources as Source[]) ?? [],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Erreur de connexion. Vérifiez la configuration du webhook.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <FilterBar active={filter} onChange={setFilter} />

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 rounded-full bg-[#58A6FF]/10 border border-[#58A6FF]/30 flex items-center justify-center mb-4">
              <span className="text-2xl">📡</span>
            </div>
            <h3 className="text-[#C9D1D9] font-semibold mb-2">Expert Broadcast RAG</h3>
            <p className="text-sm text-[#8B949E] max-w-sm">
              Posez vos questions techniques sur les mélangeurs vidéo, protocoles, encodeurs et configurations broadcast.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-2 w-full max-w-sm">
              {[
                'Comment configurer NDI sur vMix ?',
                'Différence entre SDI et HDMI en broadcast ?',
                'Troubleshooting signal absent sur ATEM Mini Pro',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); textareaRef.current?.focus(); }}
                  className="text-left text-xs text-[#8B949E] bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 hover:border-[#58A6FF]/50 hover:text-[#C9D1D9] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {loading && (
          <div className="flex justify-start mb-4">
            <div className="bg-[#161B22] border border-[#30363D] rounded-lg px-4 py-3">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-[#58A6FF] rounded-full animate-bounce [animation-delay:0ms]" />
                <div className="w-1.5 h-1.5 bg-[#58A6FF] rounded-full animate-bounce [animation-delay:150ms]" />
                <div className="w-1.5 h-1.5 bg-[#58A6FF] rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="px-4 pb-4">
        <div className="flex gap-2 items-end border border-[#30363D] rounded-lg bg-[#161B22] focus-within:border-[#58A6FF]/50 transition-colors p-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Posez votre question technique broadcast... (Entrée pour envoyer)"
            rows={1}
            className="flex-1 bg-transparent text-sm text-[#C9D1D9] placeholder-[#6E7681] resize-none outline-none max-h-32 overflow-y-auto"
            style={{ fieldSizing: 'content' } as React.CSSProperties}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex-shrink-0 w-8 h-8 bg-[#58A6FF] rounded-md flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#79C0FF] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#0D1117]">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-[#6E7681] mt-1 text-center">
          Filtre actif : <span className="text-[#58A6FF]">{filter === 'all' ? 'Tous les documents' : filter}</span>
        </p>
      </form>
    </div>
  );
}
