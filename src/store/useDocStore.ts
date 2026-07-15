import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DocumentItem {
  id: string;
  title: string;
  content: string;
  createdAt: number;
}

interface DocState {
  documents: DocumentItem[];
  activeDocId: string | null;
  geminiApiKey: string;
  ollamaEndpoint: string;
  aiProvider: 'gemini' | 'ollama';
  setGeminiApiKey: (key: string) => void;
  setOllamaEndpoint: (endpoint: string) => void;
  setAiProvider: (provider: 'gemini' | 'ollama') => void;
  createDocument: (title: string, content: string) => void;
  updateActiveDocumentContent: (content: string) => void;
  deleteDocument: (id: string) => void;
}

export const useDocStore = create<DocState>()(
  persist(
    (set) => ({
      documents: [
        {
          id: 'demo',
          title: 'Welcome Document',
          content: '<h1>Getting Started</h1><p>Paste raw text in the left box and use the AI Beautifier to structure it.</p>',
          createdAt: Date.now(),
        },
      ],
      activeDocId: 'demo',
      geminiApiKey: '',
      ollamaEndpoint: 'http://localhost:11434',
      aiProvider: 'gemini',
      setGeminiApiKey: (key) => set({ geminiApiKey: key }),
      setOllamaEndpoint: (endpoint) => set({ ollamaEndpoint: endpoint }),
      setAiProvider: (provider) => set({ aiProvider: provider }),
      createDocument: (title, content) => {
        const id = Math.random().toString(36).substring(7);
        const newDoc = { id, title, content, createdAt: Date.now() };
        set((state) => ({
          documents: [newDoc, ...state.documents],
          activeDocId: id,
        }));
      },
      updateActiveDocumentContent: (content) =>
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === state.activeDocId ? { ...doc, content } : doc
          ),
        })),
      deleteDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((doc) => doc.id !== id),
          activeDocId: state.activeDocId === id ? (state.documents[0]?.id || null) : state.activeDocId,
        })),
    }),
    {
      name: 'beautifydocs-storage',
    }
  )
);