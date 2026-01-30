import { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';

const API_KEY = process.env.API_KEY;

// Extend the global Window interface for webkitSpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export const useLiveConversation = (
  systemInstruction: string,
  onConversationEnd: () => void
) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [error, setError] = useState('');

  const recognitionRef = useRef<any | null>(null);
  const chatRef = useRef<Chat | null>(null);
  const finalTranscriptRef = useRef('');

  useEffect(() => {
    try {
      if (!API_KEY) throw new Error("API key is missing.");
      const ai = new GoogleGenAI({ apiKey: API_KEY, vertexai: true });
      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction },
      });
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'Failed to initialize AI chat.');
    }
  }, [systemInstruction]);

  useEffect(() => {
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let interim = '';
      finalTranscriptRef.current = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscriptRef.current + interim);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setError(`Speech error: ${event.error}`);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const speak = useCallback((text: string) => {
    if (!text || !window.speechSynthesis) {
      onConversationEnd();
      return;
    }
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      setIsSpeaking(false);
      onConversationEnd();
    };
    utterance.onerror = (e) => {
      console.error('Speech synthesis error', e);
      setError('Sorry, I had trouble speaking.');
      setIsSpeaking(false);
      onConversationEnd();
    };
    window.speechSynthesis.speak(utterance);
  }, [onConversationEnd]);

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const processTranscript = useCallback(async (text: string) => {
    if (!text.trim() || !chatRef.current) {
      onConversationEnd();
      return;
    }
    setAiResponse('');
    try {
      const result = await chatRef.current.sendMessage(text);
      const responseText = result.text;
      setAiResponse(responseText);
      speak(responseText);
    } catch (e) {
      console.error(e);
      const errorMsg = 'Sorry, I had trouble responding.';
      setError(errorMsg);
      speak(errorMsg);
    }
  }, [speak, onConversationEnd]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening && !isSpeaking) {
      finalTranscriptRef.current = '';
      setTranscript('');
      setAiResponse('');
      setError('');
      setIsListening(true);
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Error starting recognition:", e);
        setError("Could not start listening. Please check microphone permissions.");
        setIsListening(false);
      }
    }
  }, [isListening, isSpeaking]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      // Give a moment for the final transcript to be processed by the 'onresult' event
      setTimeout(() => {
        processTranscript(finalTranscriptRef.current);
      }, 200);
    }
  }, [isListening, processTranscript]);

  const stopAll = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    stopSpeaking();
  }, [isListening, stopListening, stopSpeaking]);

  return { isListening, isSpeaking, transcript, aiResponse, error, startListening, stopListening, stopAll };
};
