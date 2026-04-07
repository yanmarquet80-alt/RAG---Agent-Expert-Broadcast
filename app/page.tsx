import { ChatInterface } from '@/components/ChatInterface';
import { DocumentList } from '@/components/DocumentList';

export default function Home() {
  return (
    <div className="flex h-screen bg-[#0D1117] text-[#C9D1D9]">
      <DocumentList />
      <main className="flex flex-col flex-1 overflow-hidden">
        <header className="px-4 py-3 border-b border-[#30363D] bg-[#161B22] flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#58A6FF]/10 border border-[#58A6FF]/30 flex items-center justify-center">
            <span className="text-sm">📡</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-[#C9D1D9]">Expert Broadcast RAG</h1>
            <p className="text-[10px] text-[#6E7681]">Documentation technique indexée — mélangeurs, protocoles, encodeurs</p>
          </div>
        </header>
        <ChatInterface />
      </main>
    </div>
  );
}
