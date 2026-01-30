import React, { useEffect } from 'react';
import { IconCheckCircle } from './Icons.tsx';

interface ToastProps {
  message: string;
  show: boolean;
  onDismiss: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, show, onDismiss }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onDismiss]);

  return (
    <div
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md text-white rounded-full py-3 px-5 shadow-2xl">
        <IconCheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
        <p className="font-semibold text-sm">{message}</p>
      </div>
    </div>
  );
};

export default Toast;
