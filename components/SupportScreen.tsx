import React, { useState, useRef, useEffect } from 'react';
import { IconChevronLeft, IconPaperAirplane } from './Icons.tsx';
import { useGemini } from '../hooks/useGemini.ts';
import type { ChatMessage } from '../types.ts';
import { useView } from '../App.tsx';
import ChatBubble from './ChatBubble.tsx';

const SUPPORT_SYSTEM_INSTRUCTION = `You are a River Customer Support AI. Your primary goal is to help users with their issues. Be empathetic, clear, and concise.
- Start by greeting the user and asking how you can help.
- If you cannot solve the issue, offer to connect them to a human agent.
- Available topics: Billing, Service Issues, Plan Changes, Technical Support.`;

const SupportScreen: React.FC = () => {
  const { setCurrentView } = useView();
  const { messages, isLoading, error, sendMessage, setMessages } = useGemini(SUPPORT_SYSTEM_INSTRUCTION);
  const [input, setInput] = useState('');
  const [humanAgentRequested, setHumanAgentRequested] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'system-support-welcome',
        role: 'model',
        text: "Hello! Welcome to River Support. How can I assist you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length, setMessages]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim() && !isLoading && !humanAgentRequested) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  const handleRequestHuman = () => {
    setHumanAgentRequested(true);
    const systemMessage: ChatMessage = {
      id: `system-${Date.now()}`,
      role: 'system',
      text: 'Connecting you to a human agent. Please wait a moment...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="w-full h-full bg-[var(--new-bg)] flex flex-col font-sans text-[var(--accent-color)]">
      <header className="p-4 flex justify-between items-center flex-shrink-0 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
        <button onClick={() => setCurrentView('dashboard')} className="p-2 -ml-2"><IconChevronLeft className="w-6 h-6" /></button>
        <h1 className="text-lg font-semibold">Support</h1>
        <div className="w-8"></div>
      </header>

      <main ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {error && <div className="text-center text-red-500 text-sm p-2 bg-red-100 rounded-lg">{error}</div>}
      </main>

      <footer className="p-4 flex-shrink-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 space-y-3">
        {!humanAgentRequested && (
          <button onClick={handleRequestHuman} className="w-full text-center text-sm text-blue-600 font-semibold hover:underline">
            Talk to a Human Agent
          </button>
        )}
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={humanAgentRequested ? "Waiting for an agent..." : "Describe your issue..."}
            className="w-full pl-4 pr-12 py-3 bg-gray-100 border-2 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-shadow"
            disabled={isLoading || humanAgentRequested}
            aria-label="Chat input"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim() || humanAgentRequested}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            aria-label="Send message"
          >
            <IconPaperAirplane className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default SupportScreen;
