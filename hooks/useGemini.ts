import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { ChatMessage } from '../types.ts';

// The API key is injected from the environment.
const API_KEY = process.env.API_KEY;

export const useGemini = (systemInstruction: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);

  const initializeChat = useCallback(() => {
    try {
      if (!API_KEY) {
        const errorMessage = "API key is missing. Please ensure it's configured in your environment.";
        console.error(errorMessage);
        setError(errorMessage);
        return;
      }
      const ai = new GoogleGenAI({ apiKey: API_KEY, vertexai: true });
      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: systemInstruction,
        },
      });
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'Failed to initialize AI chat.';
      setError(errorMessage);
    }
  }, [systemInstruction]);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!chatRef.current) {
      initializeChat();
      if (!chatRef.current) {
        setError('Chat is not initialized. Please check your API key and configuration.');
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    const userMsgId = `user-${Date.now()}`;
    const userMessageEntry: ChatMessage = {
      id: userMsgId,
      role: 'user',
      text: userMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMessageEntry]);

    try {
      const stream = await chatRef.current.sendMessageStream({ message: userMessage });
      
      let modelResponse = '';
      const modelMsgId = `model-${Date.now()}`;
      
      // Add a placeholder for the model's response
      setMessages(prev => [...prev, {
        id: modelMsgId,
        role: 'model',
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);

      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setMessages(prev => prev.map(msg => 
          msg.id === modelMsgId ? { ...msg, text: modelResponse } : msg
        ));
      }

    } catch (e) {
      console.error(e);
      const errorMsg = e instanceof Error ? e.message : 'An unknown error occurred.';
      const fullError = `Sorry, I encountered an issue. ${errorMsg}`;
      setError(fullError);
      // Add an error message to the chat
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'system',
        text: fullError,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [initializeChat]);

  // Re-initialize chat when systemInstruction changes
  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  return { messages, isLoading, error, sendMessage, setMessages };
};
