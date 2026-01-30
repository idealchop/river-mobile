import React, { useState, useEffect } from 'react';
import { IconChevronLeft, IconPaperAirplane, IconAdjustmentsHorizontal } from './Icons.tsx';
import { useGemini } from '../hooks/useGemini.ts';
import type { ChatMessage, AIPersonality } from '../types.ts';
import { useView } from '../App.tsx';
import AIVisualizer from './AIVisualizer.tsx';
import { RIVER_AI_SYSTEM_INSTRUCTION } from '../constants.ts';

const generateSystemInstruction = (personality: AIPersonality) => {
    let instruction = RIVER_AI_SYSTEM_INSTRUCTION;
    instruction += `\n\n# User-defined Personality:\n`;
    instruction += `- Tone: Your tone should be ${personality.tone}. `;
    if (personality.tone === 'Friendly') {
        instruction += 'Be warm and use emojis. ';
    } else if (personality.tone === 'Straightforward') {
        instruction += 'Be direct and concise. ';
    }
    instruction += `- Humor: Your humor level should be ${personality.humor}. `;
    if (personality.humor === 'High') {
        instruction += 'Feel free to use witty remarks and jokes. ';
    } else if (personality.humor === 'None') {
        instruction += 'Do not use any humor. ';
    }
    instruction += `- Language: Your primary language should be ${personality.language}. If set to Auto-detect, respond in the language the user is using (English or Tagalog).`;
    return instruction;
};

const RiverAIScreen: React.FC = () => {
  const { setCurrentView, aiPersonality } = useView();
  const [systemInstruction, setSystemInstruction] = useState(() => generateSystemInstruction(aiPersonality));
  
  useEffect(() => {
    setSystemInstruction(generateSystemInstruction(aiPersonality));
  }, [aiPersonality]);

  const { messages, isLoading, error, sendMessage, setMessages } = useGemini(systemInstruction);
  const [input, setInput] = useState('');
  const [latestResponse, setLatestResponse] = useState("Good morning! Kamusta ang araw mo? 😊 How can I help?");

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'model' && lastMessage.text) {
      setLatestResponse(lastMessage.text);
    } else if (messages.length === 0) {
        setLatestResponse("I've been updated! How can I help you now?");
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      setLatestResponse(''); // Clear previous response
      sendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      <div className="w-full h-full bg-[var(--accent-color)] flex flex-col font-sans text-white">
        <header className="p-4 flex justify-between items-center flex-shrink-0 z-10">
          <button onClick={() => setCurrentView('dashboard')} className="p-2 -ml-2"><IconChevronLeft className="w-6 h-6" /></button>
          <h1 className="text-lg font-semibold">River AI</h1>
          <button onClick={() => setCurrentView('settings-customize-ai')} className="p-2 -mr-2" aria-label="Customize AI">
            <IconAdjustmentsHorizontal className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-grow flex flex-col items-center justify-center p-6 text-center relative -mt-16">
          <AIVisualizer isLoading={isLoading} />
          <div className="mt-8 min-h-[6rem] flex flex-col justify-center">
            {isLoading && !latestResponse && (
               <p className="text-lg text-gray-400 animate-pulse">Thinking...</p>
            )}
            {latestResponse && (
              <p className="text-lg text-gray-300 leading-relaxed">{latestResponse}</p>
            )}
            {error && (
              <p className="text-lg text-red-400 leading-relaxed">{error}</p>
            )}
          </div>
        </main>

        <footer className="p-4 flex-shrink-0 bg-transparent z-10">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask River AI..."
              className="w-full pl-4 pr-12 py-3 bg-black/20 border border-white/20 rounded-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow"
              disabled={isLoading}
              aria-label="Chat input"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center bg-blue-500 text-white disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
              aria-label="Send message"
            >
              <IconPaperAirplane className="w-5 h-5" />
            </button>
          </div>
        </footer>
      </div>
    </>
  );
};

export default RiverAIScreen;
