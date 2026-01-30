
import React from 'react';
import { IconCheckCircle } from './Icons.tsx';

interface ConfirmationModalProps {
  isOpen: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-black/70 backdrop-blur-md text-white rounded-2xl p-6 flex flex-col items-center space-y-3 shadow-2xl">
        <IconCheckCircle className="w-12 h-12 text-green-400" />
        <p className="font-semibold">Refill Requested</p>
      </div>
    </div>
  );
};

export default ConfirmationModal;
