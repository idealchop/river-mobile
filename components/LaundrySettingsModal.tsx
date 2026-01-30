import React, { useState } from 'react';
import { IconPlus, IconMinus } from './Icons.tsx';

interface LaundrySettingsModalProps {
  onClose: () => void;
  availableKg: number;
}

const LaundrySettingsModal: React.FC<LaundrySettingsModalProps> = ({ onClose, availableKg }) => {
  const [additionalKg, setAdditionalKg] = useState(0);
  const totalKg = availableKg + additionalKg;

  return (
    <div className="space-y-4">
        <div className="rounded-lg overflow-hidden">
            <img src="https://placehold.co/600x300/E0E7FF/4338CA?text=Your+Laundry+Allowance" alt="Laundry Status Placeholder" className="w-full h-auto object-cover" />
        </div>
        
        <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                <p className="font-semibold text-gray-600">Included in Plan</p>
                <p className="font-bold text-lg">{availableKg.toFixed(1)} KG</p>
            </div>
             <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                <p className="font-semibold text-gray-600">Additional KG</p>
                <div className="flex items-center gap-3">
                    <button onClick={() => setAdditionalKg(p => Math.max(0, p - 1))} className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center"><IconMinus className="w-4 h-4" /></button>
                    <span className="text-lg font-bold w-8 text-center">{additionalKg}</span>
                    <button onClick={() => setAdditionalKg(p => p + 1)} className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center"><IconPlus className="w-4 h-4" /></button>
                </div>
            </div>
             <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-bold text-blue-800">Total for this Cycle</p>
                <p className="font-extrabold text-2xl text-blue-600">{totalKg.toFixed(1)} KG</p>
            </div>
        </div>
        <p className="text-xs text-gray-500 text-center">Any additional KG will be automatically added to your next monthly bill.</p>
         <button onClick={onClose} className="w-full mt-4 bg-blue-500 text-white font-bold py-3 px-4 rounded-xl">Confirm</button>
    </div>
  );
};

export default LaundrySettingsModal;
