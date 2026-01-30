import React, { useEffect, useState, useCallback } from 'react';
import { useView } from '../App.tsx';
import { useLiveConversation } from '../hooks/useLiveConversation.ts';
import AIVisualizer from './AIVisualizer.tsx';
import { IconMicrophone, IconX } from './Icons.tsx';
import { RIVER_AI_SYSTEM_INSTRUCTION } from '../constants.ts';

const LiveConversationModal: React.FC = () => {
  const { isLiveConversationActive, setIsLiveConversationActive } = useView();
  const [showModal, setShowModal] = useState(false);

  const handleConversationEnd = useCallback(() => {
    setIsLiveConversationActive(false);
  }, [setIsLiveConversationActive]);

  const {
    isListening,
    isSpeaking,
    transcript,
    aiResponse,
    error,
    startListening,
    stopListening,
    stopAll,
  } = useLiveConversation(RIVER_AI_SYSTEM_INSTRUCTION, handleConversationEnd);

  useEffect(() => {
    if (isLiveConversationActive) {
      setShowModal(true);
      startListening();
    } else {
      stopListening();
    }
  }, [isLiveConversationActive, startListening, stopListening]);

  useEffect(() => {
    if (showModal && !isLiveConversationActive && !isListening && !isSpeaking) {
      const timer = setTimeout(() => {
        setShowModal(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showModal, isLiveConversationActive, isListening, isSpeaking]);

  const handleClose = () => {
    stopAll();
    setIsLiveConversationActive(false);
  };

  if (!showModal) {
    return null;
  }

  let statusText = "Press & hold the middle button to talk";
  if (isListening) statusText = transcript || "Listening...";
  if (isSpeaking) statusText = aiResponse || "Thinking...";
  if (error) statusText = error;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex flex-col items-center justify-center animate-fade-in">
      <button onClick={handleClose} className="absolute top-8 right-8 text-white/70 hover:text-white z-10" aria-label="Close live conversation">
        <IconX className="w-8 h-8" />
      </button>
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-white">
        <AIVisualizer isLoading={isListening || isSpeaking} />
        <p className="text-2xl font-semibold mt-8 text-center min-h-[6rem] max-w-md">{statusText}</p>
        <div className="absolute bottom-24">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 bg-blue-500 ${isListening ? 'ring-4 ring-red-500/70 animate-pulse' : ''}`}>
            <IconMicrophone className="w-10 h-10 text-white" />
          </div>
        </div>
        <p className="absolute bottom-12 text-gray-400 text-sm">Release to send</p>
      </div>
    </div>
  );
};

export default LiveConversationModal;
