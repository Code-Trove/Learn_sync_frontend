export interface KanbanItem {
  id: string;
  title: string;
  description: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  items: KanbanItem[];
  count?: number; // Make `count` optional if not always needed
}

// types/index.ts
export interface SearchResult {
  response: string;
  link?: string;
  contextMetadata?: any[]; // Add this
  conversationId?: string; // Add this
  // ... other existing properties
}

interface SearchSectionProps {
  onSearch: (query: string) => Promise<void>;
  results: SearchResult[];
  loading: boolean;
  expandedCard: string | null; // Add this property
  setExpandedCard: React.Dispatch<React.SetStateAction<string | null>>; // Add this property
}
