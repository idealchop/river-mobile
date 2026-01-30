
import React from 'react';
import { IconX } from './Icons.tsx';

interface AttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachmentUrl: string;
  title: string;
}

const AttachmentModal: React.FC<AttachmentModalProps> = ({ isOpen, onClose, attachmentUrl, title }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl p-4 w-[90%] max-w-lg max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center mb-2 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800">
            <IconX className="w-6 h-6" />
          </button>
        </header>
        <div className="flex-grow overflow-hidden rounded-lg">
          <img src={attachmentUrl} alt={title} className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  );
};

export default AttachmentModal;
