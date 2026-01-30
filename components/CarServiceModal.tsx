import React, { useState } from 'react';
// FIX: Removed unused IconCircle import
import { IconCheckCircle } from './Icons.tsx';

interface CarServiceModalProps {
  onClose: () => void;
  onConfirm: (selectedServices: string[]) => void;
}

const otherServices = [
  { name: 'Interior Detailing', price: '₱2500' },
  { name: 'Wax & Polish', price: '₱1800' },
  { name: 'Tire Shine', price: '₱500' },
];

const CarServiceModal: React.FC<CarServiceModalProps> = ({ onClose, onConfirm }) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const toggleService = (serviceName: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceName) 
        ? prev.filter(s => s !== serviceName) 
        : [...prev, serviceName]
    );
  };

  const handleConfirm = () => {
    onConfirm(selectedServices);
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg">
        <p className="font-bold">FREE Carwash / month</p>
        <p className="text-sm">Included in your current plan.</p>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-500">Other Services</label>
        <ul className="mt-2 space-y-2">
          {otherServices.map(service => {
            const isSelected = selectedServices.includes(service.name);
            return (
              <li key={service.name}>
                <button 
                  onClick={() => toggleService(service.name)}
                  className="w-full flex justify-between items-center p-3 bg-gray-100 rounded-lg text-left"
                >
                  <div>
                    <p className="font-semibold">{service.name}</p>
                    <span className="text-sm text-gray-500">{service.price}</span>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                    {isSelected && <IconCheckCircle className="w-5 h-5 text-white" />}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <button onClick={handleConfirm} className="w-full mt-4 bg-blue-500 text-white font-bold py-3 px-4 rounded-xl">Confirm Services</button>
    </div>
  );
};

export default CarServiceModal;
