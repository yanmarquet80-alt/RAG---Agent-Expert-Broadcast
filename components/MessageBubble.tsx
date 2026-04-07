'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage } from '@/lib/types';
import { SourceCard } from './SourceCard';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[85%] ${isUser ? 'order-2' : 'order-1'}`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-full bg-[#58A6FF] flex items-center justify-center">
              <span className="text-[10px] font-bold text-[#0D1117]">B</span>
            </div>
            <span className="text-xs text-[#8B949E] font-medium">Expert Broadcast</span>
          </div>
        )}

        <div
          className={`rounded-lg px-4 py-3 ${
            isUser
              ? 'bg-[#58A6FF] text-[#0D1117]'
              : 'bg-[#161B22] border border-[#30363D] text-[#C9D1D9]'
          }`}
        >
          {isUser ? (
            <p className="text-sm font-medium">{message.content}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code: ({ className, children, ...props }) => {
                    const isBlock = className?.includes('language-');
                    return isBlock ? (
                      <pre className="bg-[#0D1117] border border-[#30363D] rounded p-3 overflow-x-auto my-3">
                        <code className={`text-xs font-mono text-[#79C0FF] ${className}`} {...props}>
                          {children}
                        </code>
                      </pre>
                    ) : (
                      <code className="bg-[#0D1117] text-[#79C0FF] px-1 py-0.5 rounded text-xs font-mono" {...props}>
                        {children}
                      </code>
                    );
                  },
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-3">
                      <table className="text-xs border-collapse w-full">{children}</table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-[#30363D] px-3 py-2 bg-[#21262D] text-left font-semibold text-[#C9D1D9]">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-[#30363D] px-3 py-2 text-[#8B949E]">{children}</td>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-sm font-semibold text-[#58A6FF] mt-4 mb-2 border-b border-[#30363D] pb-1">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm font-semibold text-[#C9D1D9] mt-3 mb-1">{children}</h3>
                  ),
                  strong: ({ children }) => (
                    <strong className="text-[#C9D1D9] font-semibold">{children}</strong>
                  ),
                  a: ({ href, children }) => (
                    <a href={href} className="text-[#58A6FF] hover:underline" target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {!isUser && message.sources && <SourceCard sources={message.sources} />}

        <p className="text-[10px] text-[#6E7681] mt-1 px-1">
          {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
