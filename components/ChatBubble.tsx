
import React from 'react';
import { IconRiverAI, IconUserCircle } from './Icons.tsx';
import type { ChatMessage } from '../types.ts';

interface ChatBubbleProps {
  message: ChatMessage;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isModel = message.role === 'model';
  const isSystem = message.role === 'system';

  const TypingIndicator = () => (
    <div className="flex items-center space-x-1 p-2">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
  );

  if (isSystem) {
    return (
      <div className="text-center text-red-500 text-sm p-2 bg-red-100 rounded-lg mx-auto max-w-sm">
        <p>{message.text}</p>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-3 ${isModel ? '' : 'justify-end'}`}>
      {isModel && (
        <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-md">
          <IconRiverAI className="w-5 h-5" />
        </div>
      )}
      <div className={`flex flex-col ${isModel ? 'items-start' : 'items-end'}`}>
        <div 
          className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl shadow-sm ${isModel ? 'bg-white text-gray-800 rounded-tl-none' : 'bg-blue-500 text-white rounded-br-none'}`}
        >
          {message.text ? (
            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
          ) : (
            <TypingIndicator />
          )}
        </div>
        <span className="text-xs text-gray-400 mt-1.5 px-1">{message.timestamp}</span>
      </div>
      {!isModel && (
        <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-gray-200 text-gray-500 shadow-sm">
          <IconUserCircle className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
