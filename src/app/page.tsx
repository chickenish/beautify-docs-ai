'use client';

import React, { useState } from 'react';
import { useDocStore } from '@/store/useDocStore';
import { formatTextWithAI } from '@/services/aiService';
import Editor from '@/components/Editor';
import AISettings from '@/components/AISettings';
import { Wand2, Sparkles, Code2, Plus, LayoutGrid, FileDown } from 'lucide-react';

export default function Home() {
  const {
    documents,
    activeDocId,
    createDocument,
    updateActiveDocumentContent,
    geminiApiKey,
    ollamaEndpoint,
    aiProvider,
  } = useDocStore();

  const [rawInput, setRawInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const activeDoc = documents.find((doc) => doc.id === activeDocId) || documents[0];

  const handleBeautify = async () => {
    if (!rawInput.trim()) return;
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const formattedHtml = await formatTextWithAI({
        provider: aiProvider,
        apiKey: geminiApiKey,
        ollamaEndpoint,
        rawText: rawInput,
      });

      // Extract title from first line of text or fallback
      const fallbackTitle = 'Beautified Doc ' + new Date().toLocaleDateString();
      createDocument(fallbackTitle, formattedHtml);
      setRawInput(''); 
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during formatting.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!activeDoc) return;
    const blob = new Blob([activeDoc.content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeDoc.title.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6">
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-indigo-600" /> BeautifyDocs AI
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Turn messy, unstructured raw notes into beautifully formatted documents.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => createDocument('Untitled Draft', '<h1>Untitled</h1><p>Write something new...</p>')}
            className="flex items-center gap-2 p-2.5 px-4 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-semibold text-sm transition"
          >
            <Plus className="w-4 h-4" /> New Doc
          </button>
          <button
            onClick={handleDownload}
            disabled={!activeDoc}
            className="flex items-center gap-2 p-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-semibold text-sm transition disabled:opacity-50"
          >
            <FileDown className="w-4 h-4" /> Export File
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <AISettings />

          <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-sm space-y-4">
            <h3 className="font-semibold flex items-center gap-2 text-base">
              <Code2 className="w-4 h-4 text-indigo-600" /> Paste Raw Content
            </h3>
            <textarea
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="Paste meeting transcript snippets, unformatted logs, fragments, or unstructured plans here..."
              className="w-full h-64 p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-indigo-600/20 focus:outline-none font-mono"
            />
            {errorMessage && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium">
                {errorMessage}
              </div>
            )}
            <button
              onClick={handleBeautify}
              disabled={isProcessing || !rawInput.trim()}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition disabled:opacity-50"
            >
              <Wand2 className="w-4 h-4" />
              {isProcessing ? 'Processing content...' : 'Beautify Document'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-indigo-600" /> Visual Workspace
            </h2>
          </div>

          {activeDoc ? (
            <Editor
              content={activeDoc.content}
              onChange={(updatedHtml) => updateActiveDocumentContent(updatedHtml)}
            />
          ) : (
            <div className="border border-dashed rounded-xl p-12 text-center text-zinc-400 flex flex-col items-center justify-center bg-white dark:bg-zinc-950">
              <Sparkles className="w-12 h-12 mb-3 opacity-40 text-indigo-600" />
              <p className="text-sm font-medium">No document active</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}