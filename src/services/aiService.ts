import { GoogleGenerativeAI } from '@google/generative-ai';

interface AIFormatConfig {
  provider: 'gemini' | 'ollama';
  apiKey?: string;
  ollamaEndpoint?: string;
  rawText: string;
}

export async function formatTextWithAI({
  provider,
  apiKey,
  ollamaEndpoint = 'http://localhost:11434',
  rawText,
}: AIFormatConfig): Promise<string> {
  const systemPrompt = `You are an expert AI Document Structurer. Your task is to transform messy, unformatted text into a structured, highly clean HTML document.
  Rules:
  - Add headings hierarchy (H1, H2, H3) where logical. Use proper tags like <h1>, <h2>, <p>, <ul>, <li>.
  - Convert lists into bulleted, numbered, or checklists.
  - Insert tables or structured blocks where appropriate.
  - Highlight warnings, notes, or callouts with styled boxes.
  - Preserve all factual detail, original URLs, and numbers. Do not hallucinate or change information.
  - Return ONLY raw HTML output without any markdown formatting wrappers (like \`\`\`html). Do not explain your thought process.`;

  if (provider === 'gemini') {
    if (!apiKey) {
      throw new Error('Please provide your free Gemini API Key in the settings panel.');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

    const result = await model.generateContent([
      { text: `${systemPrompt}\n\nRaw text to analyze:\n${rawText}` },
    ]);
    const response = await result.response;
    return response.text().trim();
  } else {
    try {
      const response = await fetch(`${ollamaEndpoint}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3',
          prompt: `${systemPrompt}\n\nRaw text to analyze:\n${rawText}`,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect to local Ollama instance.');
      }

      const data = await response.json();
      return data.response.trim();
    } catch (err) {
      throw new Error('Ollama service is unreachable. Ensure Ollama is running locally and CORS is enabled.');
    }
  }
}