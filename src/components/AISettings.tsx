'use client';

import React from 'react';
import { useDocStore } from '@/store/useDocStore';

export default function AISettings() {
  const {
    geminiApiKey,
    setGeminiApiKey,
    ollamaEndpoint,
    setOllamaEndpoint,
    aiProvider,
    setAiProvider,
  } = useDocStore();

  return (
    <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-foreground space-y-4 shadow-sm">
      <h3 className="font-semibold text-base">AI Configuration</h3>
      <p className="text-xs text-zinc-500">
        Choose a free provider option below.
      </p>

      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2 text-sm cursor-pointer font-medium">
          <input
            type="radio"
            name="provider"
            checked={aiProvider === 'gemini'}
            onChange={() => setAiProvider('gemini')}
            className="accent-indigo-600"
          />
          Google Gemini (Free)
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer font-medium">
          <input
            type="radio"
            name="provider"
            checked={aiProvider === 'ollama'}
            onChange={() => setAiProvider('ollama')}
            className="accent-indigo-600"
          />
          Ollama (Local Offline)
        </label>
      </div>

      {aiProvider === 'gemini' ? (
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">Gemini API Key</label>
          <input
            type="password"
            placeholder="Paste your API key here"
            value={geminiApiKey}
            onChange={(e) => setGeminiApiKey(e.target.value)}
            className="w-full text-sm p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900"
          />
          <p className="text-[10px] text-zinc-500">
            Get a free API key from{' '}
            <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="underline text-indigo-600 font-medium">
              Google AI Studio
            </a>.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">Ollama Endpoint</label>
          <input
            type="text"
            placeholder="http://localhost:11434"
            value={ollamaEndpoint}
            onChange={(e) => setOllamaEndpoint(e.target.value)}
            className="w-full text-sm p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900"
          />
        </div>
      )}
    </div>
  );
}