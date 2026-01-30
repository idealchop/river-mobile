import React, { useState, useEffect } from 'react';
import { IconX, IconCrosshairs, IconMapPin, IconMagnifyingGlass } from './Icons.tsx';
import type { Address } from '../types.ts';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Address) => void;
  initialAddress: Address;
}

const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose, onSave, initialAddress }) => {
  const [address, setAddress] = useState<Address>(initialAddress);
  const [manualEntry, setManualEntry] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAddress(initialAddress);
      setManualEntry(null);
      setLocationStatus('idle');
      setError('');
      setSearchQuery('');
    }
  }, [isOpen, initialAddress]);

  const handleUseLocation = () => {
    setLocationStatus('loading');
    setError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setTimeout(() => {
          const newAddress = {
            line1: '123 GPS Street',
            line2: 'Geolocation Subdivision',
            city: 'Makati City',
            province: 'Metro Manila',
          };
          setAddress(newAddress);
          setManualEntry(null);
          setLocationStatus('idle');
        }, 1500);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setError('Could not get location. Please enable location services or enter manually.');
        setLocationStatus('error');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setLocationStatus('loading');
    setTimeout(() => {
      const newAddress = {
        line1: searchQuery,
        line2: 'Unit 101',
        city: 'Quezon City',
        province: 'Metro Manila',
      };
      setAddress(newAddress);
      setManualEntry(null);
      setLocationStatus('idle');
    }, 1000);
  };

  const handleManualAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setManualEntry(e.target.value);
  };

  const handleSave = () => {
    if (manualEntry !== null) {
      onSave({
        line1: manualEntry,
        line2: '',
        city: '',
        province: '',
      });
    } else {
      onSave(address);
    }
    onClose();
  };

  const displayAddress = manualEntry ?? Object.values(address).filter(Boolean).join('\n');

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}>
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[var(--accent-color)]">Edit Address</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800"><IconX className="w-6 h-6" /></button>
        </header>
        <div className="space-y-4">
          <div className="relative h-48 w-full bg-gray-200 rounded-lg overflow-hidden">
            <img src="https://i.imgur.com/5V1v1L4.png" alt="Map placeholder" className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <IconMapPin className="w-10 h-10 text-red-500 drop-shadow-lg" />
            </div>
          </div>

          <form onSubmit={handleSearch} className="relative">
            <IconMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for an address"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>

          <button 
            onClick={handleUseLocation} 
            disabled={locationStatus === 'loading'}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-blue-500 text-blue-500 font-bold rounded-xl hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            {locationStatus === 'loading' ? (
              <>
                <div className="w-5 h-5 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                <span>Getting Location...</span>
              </>
            ) : (
              <>
                <IconCrosshairs className="w-5 h-5" />
                <span>Use my current location</span>
              </>
            )}
          </button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">OR EDIT MANUALLY</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <textarea
            placeholder="Enter full address"
            value={displayAddress}
            onChange={handleManualAddressChange}
            className="w-full h-28 p-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />

          <button onClick={handleSave} className="w-full mt-6 bg-[var(--accent-color)] text-white font-bold py-3.5 px-4 rounded-2xl">Save Address</button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
