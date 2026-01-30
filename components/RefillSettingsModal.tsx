import React from 'react';
import { IconX } from './Icons.tsx';
import type { ManualRefillStatus } from '../types.ts';
import RefillStatusTracker from './RefillStatusTracker.tsx';

type RefillFrequency = 'Weekly' | 'Twice-Week';

interface RefillSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  isAutoRefillEnabled: boolean;
  setAutoRefillEnabled: (enabled: boolean) => void;
  frequency: RefillFrequency;
  setFrequency: (frequency: RefillFrequency) => void;
  onRequestNow: () => void;
  averageConsumption: number;
  manualRefillStatus: ManualRefillStatus | null;
}

const RefillSettingsModal: React.FC<RefillSettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isAutoRefillEnabled,
  setAutoRefillEnabled,
  frequency,
  setFrequency,
  onRequestNow,
  averageConsumption,
  manualRefillStatus,
}) => {
  const frequencies: RefillFrequency[] = ['Weekly', 'Twice-Week'];

  return (
    <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}>
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[var(--accent-color)]">Refill Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800"><IconX className="w-6 h-6" /></button>
        </header>

        <div className="space-y-6">
          <div className="bg-gray-100 rounded-xl p-4 text-center">
            <p className="text-sm font-semibold text-gray-500">Average Daily Use</p>
            <p className="text-3xl font-bold text-[var(--accent-color)] mt-1">{averageConsumption.toFixed(1)} L</p>
          </div>

          <div className="flex justify-between items-center bg-gray-100 p-3 rounded-xl">
            <span className="font-semibold text-gray-800">Auto-Refill</span>
            <label htmlFor="auto-refill-toggle" className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                id="auto-refill-toggle" 
                className="sr-only peer" 
                checked={isAutoRefillEnabled} 
                onChange={() => setAutoRefillEnabled(!isAutoRefillEnabled)} 
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          {isAutoRefillEnabled ? (
            <div className="animate-fade-in">
              <label className="text-sm font-semibold text-gray-500">Frequency</label>
              <div className="mt-4 grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl">
                {frequencies.map(freq => {
                  const isActive = frequency === freq;
                  return (
                    <div key={freq} className="relative">
                      {isActive && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full z-10">
                          Active
                        </span>
                      )}
                      <button 
                        onClick={() => setFrequency(freq)} 
                        className={`w-full px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive ? 'bg-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
                      >
                        {freq}
                      </button>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">We'll automatically schedule a refill based on your consumption and selected frequency.</p>
            </div>
          ) : (
            <div className="animate-fade-in">
              {manualRefillStatus && manualRefillStatus.stage !== 'completed' ? (
                <RefillStatusTracker status={manualRefillStatus} />
              ) : (
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-800 font-semibold">You are managing refills manually.</p>
                  <p className="text-xs text-blue-600 mt-1">Request a refill when your supply is low.</p>
                  <button 
                    onClick={onRequestNow} 
                    className="mt-4 w-full bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl hover:bg-blue-600 transition-colors"
                  >
                    Request a Refill Now
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        <button onClick={onSave} className="w-full mt-8 bg-[var(--accent-color)] text-white font-bold py-3.5 px-4 rounded-2xl">Save Settings</button>
      </div>
    </div>
  );
};

export default RefillSettingsModal;
