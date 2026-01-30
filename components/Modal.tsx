
import React from 'react';
import { IconX } from './Icons.tsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-[var(--accent-color)] text-white w-[90%] max-w-lg max-h-[80vh] rounded-2xl shadow-lg flex flex-col p-6 border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <IconX className="w-6 h-6" />
          </button>
        </header>
        <div className="overflow-y-auto pr-2 text-gray-300 text-sm prose prose-invert prose-sm max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
