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
  
  const systemPrompt = `You are a world-class Business Architect and UI Designer. 
  Your goal is to transform raw business notes into an elegant, high-impact "Notion OS Blueprint" or "Operating System Dashboard" using clean HTML.

  Follow these formatting rules strictly:
  1. Title & Header: Use a major <h1> with an appropriate workspace emoji (e.g., "🦷 DentalOS™ | Business Capability Blueprint").
  2. Section Dividers: Place a clean horizontal line (<hr class="my-6 border-zinc-200" />) between major sections.
  3. Notion-Style Callouts: For major departments, capabilities, or focus points, wrap the content in a styled callout card:
     <div class="p-4 my-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex gap-3 items-start">
       <span class="text-xl">💡</span>
       <div>
         <strong class="text-zinc-900 dark:text-zinc-100">Section Title</strong>
         <p class="text-sm text-zinc-500 mt-1">Section description...</p>
       </div>
     </div>
  4. Structured Capabilities (Tables): Use elegant tables to break down "Capability", "Owner", "Key Metrics", and "Action Items".
     Table styling: <table class="w-full text-left border-collapse my-4 text-sm"> with bordered rows (<tr class="border-b">).
  5. Checklist (SOPs): Convert procedures into interactive task lists:
     <ul class="space-y-1 my-3">
       <li class="flex items-center gap-2"><input type="checkbox" disabled class="rounded text-indigo-600" /> Task description</li>
     </ul>
  6. Tone: Highly professional, structured, consultative, and executive. 

  Preserve 100% of the user's data. Never make up details or omit names, metrics, or facts. 
  Return ONLY raw HTML. No explanation, no wrapper tags.`;

  if (provider === 'gemini') {
    if (!apiKey) {
      throw new Error('Please enter your free Gemini API Key in the settings panel.');
    }
    const genAI = new GoogleGenerativeAI(apiKey);

    // TRY THE NEW PRIMARY MODEL FIRST (gemini-3.5-flash)
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
      const result = await model.generateContent([
        { text: `${systemPrompt}\n\nRaw draft to blueprint:\n${rawText}` },
      ]);
      const response = await result.response;
      return response.text().trim();
    } catch (primaryError: any) {
      console.warn("Primary AI model (3.5) is currently busy. Attempting fallback model (2.5)...", primaryError);
      
      // SILENT FALLBACK TO STABLE MODEL (gemini-2.5-flash)
      try {
        const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await fallbackModel.generateContent([
          { text: `${systemPrompt}\n\nRaw draft to blueprint:\n${rawText}` },
        ]);
        const response = await result.response;
        return response.text().trim();
      } catch (fallbackError: any) {
        // FRIENDLY WARNING IF BOTH SERVERS ARE TEMPORARILY BUSY
        throw new Error(
          "Google's free servers are currently experiencing very high demand. Please wait 15-30 seconds and click 'Beautify' again!"
        );
      }
    }
  } else {
    try {
      const response = await fetch(`${ollamaEndpoint}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3',
          prompt: `${systemPrompt}\n\nRaw draft to blueprint:\n${rawText}`,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Could not reach Ollama.');
      }

      const data = await response.json();
      return data.response.trim();
    } catch (err) {
      throw new Error('Ollama connection failed.');
    }
  }
}