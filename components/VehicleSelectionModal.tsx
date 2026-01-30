
import React, { useState } from 'react';
import { IconSedan, IconSuv, IconTruck } from './Icons.tsx';

interface VehicleSelectionModalProps {
  onClose: () => void;
}

type VehicleType = 'Sedan' | 'SUV' | 'Truck';

const VehicleSelectionModal: React.FC<VehicleSelectionModalProps> = ({ onClose }) => {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('Sedan');

  const vehicles = [
    { name: 'Sedan', icon: IconSedan },
    { name: 'SUV', icon: IconSuv },
    { name: 'Truck', icon: IconTruck },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Select your vehicle type to customize your service.</p>
      <div className="grid grid-cols-3 gap-4">
        {vehicles.map(vehicle => {
          const Icon = vehicle.icon;
          const isSelected = selectedVehicle === vehicle.name;
          return (
            <button 
              key={vehicle.name} 
              onClick={() => setSelectedVehicle(vehicle.name as VehicleType)}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${isSelected ? 'bg-blue-100 border-blue-500' : 'bg-gray-100 border-transparent'}`}
            >
              <Icon className={`w-12 h-12 mb-2 ${isSelected ? 'text-blue-500' : 'text-gray-500'}`} />
              <span className={`font-semibold text-sm ${isSelected ? 'text-blue-600' : 'text-gray-700'}`}>{vehicle.name}</span>
            </button>
          );
        })}
      </div>
      <button onClick={onClose} className="w-full mt-4 bg-blue-500 text-white font-bold py-3 px-4 rounded-xl">Confirm</button>
    </div>
  );
};

export default VehicleSelectionModal;
