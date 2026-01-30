import React from 'react';
import { IconX } from './Icons.tsx';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <div 
      className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className={`absolute top-10 bottom-0 left-0 right-0 bg-gray-100 text-[var(--accent-color)] w-full rounded-t-2xl shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-4 flex-shrink-0 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-500 text-center w-full">{title === 'Notification Preferences' ? 'Just a moment...' : title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 absolute right-4 top-4">
            <IconX className="w-6 h-6" />
          </button>
        </header>
        <div className="flex-grow overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
