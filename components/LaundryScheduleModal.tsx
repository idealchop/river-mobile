import React from 'react';
import { IconX } from './Icons.tsx';
import type { LaundryPickupStatus } from '../types.ts';
import PickupStatusTracker from './PickupStatusTracker.tsx';

type ScheduleFrequency = 'Weekly' | 'Bi-Weekly';

interface LaundryScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  isAutomated: boolean;
  setIsAutomated: (enabled: boolean) => void;
  frequency: ScheduleFrequency;
  setFrequency: (frequency: ScheduleFrequency) => void;
  onRequestNow: () => void;
  pickupStatus: LaundryPickupStatus | null;
}

const LaundryScheduleModal: React.FC<LaundryScheduleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isAutomated,
  setIsAutomated,
  frequency,
  setFrequency,
  onRequestNow,
  pickupStatus,
}) => {
  const frequencies: ScheduleFrequency[] = ['Weekly', 'Bi-Weekly'];

  return (
    <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}>
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[var(--accent-color)]">Laundry Schedule</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800"><IconX className="w-6 h-6" /></button>
        </header>

        <div className="space-y-6">
          <div className="flex justify-between items-center bg-gray-100 p-3 rounded-xl">
            <span className="font-semibold text-gray-800">Automated Pickup</span>
            <label htmlFor="laundry-toggle" className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                id="laundry-toggle" 
                className="sr-only peer" 
                checked={isAutomated} 
                onChange={() => setIsAutomated(!isAutomated)} 
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          {isAutomated ? (
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
              <p className="text-xs text-gray-400 mt-2 text-center">We'll automatically schedule a pickup based on your selected frequency.</p>
            </div>
          ) : (
            <div className="animate-fade-in">
              {pickupStatus && pickupStatus.stage !== 'completed' ? (
                <PickupStatusTracker status={pickupStatus} />
              ) : (
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-800 font-semibold">You are managing pickups manually.</p>
                  <p className="text-xs text-blue-600 mt-1">Request a pickup when you're ready.</p>
                  <button 
                    onClick={onRequestNow} 
                    className="mt-4 w-full bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl hover:bg-blue-600 transition-colors"
                  >
                    Request Pickup Now
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

export default LaundryScheduleModal;
