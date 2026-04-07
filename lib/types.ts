export interface Source {
  pageContent: string;
  metadata: {
    category?: string;
    brand?: string;
    device_model?: string;
    doc_type?: string;
    original_name?: string;
    loc?: { pageNumber?: number };
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  timestamp: Date;
}

export interface RagDocument {
  id: string;
  original_name: string;
  category: string;
  brand: string | null;
  device_model: string | null;
  doc_type: string | null;
  status: string;
  indexed_at: string | null;
  created_at: string;
}

export type FilterCategory = 'all' | 'mixer' | 'encoder' | 'protocol' | 'cable' | 'software';
