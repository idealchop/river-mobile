import React, { useState } from 'react';
import { IconWaterDrop, IconBuildingStorefront } from './Icons.tsx';
import StationProfile from './StationProfile.tsx';
import type { Delivery } from '../types.ts';

const L_PER_GALLON = 20;

const mockDeliveries: Delivery[] = [
  { id: '1', date: '2024-05-20', amountLiters: 60 },
  { id: '2', date: '2024-04-18', amountLiters: 80 },
  { id: '3', date: '2024-03-15', amountLiters: 60 },
  { id: '4', date: '2024-02-12', amountLiters: 100 },
];

type HistoryView = 'deliveries' | 'stations';

const HistoryModalContent: React.FC = () => {
  const [activeView, setActiveView] = useState<HistoryView>('deliveries');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveView('deliveries')}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeView === 'deliveries' ? 'bg-white shadow' : 'text-gray-600'}`}
        >
          <IconWaterDrop className="w-5 h-5" />
          Deliveries
        </button>
        <button
          onClick={() => setActiveView('stations')}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeView === 'stations' ? 'bg-white shadow' : 'text-gray-600'}`}
        >
          <IconBuildingStorefront className="w-5 h-5" />
          Stations
        </button>
      </div>

      {activeView === 'deliveries' ? (
        <div className="space-y-3 animate-fade-in">
          <h3 className="font-bold text-gray-700">Delivery History</h3>
          {mockDeliveries.map(delivery => {
            const gallons = delivery.amountLiters / L_PER_GALLON;
            const gallonsDisplay = gallons % 1 === 0 ? gallons.toFixed(0) : gallons.toFixed(1);
            return (
              <div key={delivery.id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <img src="https://firebasestorage.googleapis.com/v0/b/smartrefill-singapore/o/River%20Mobile%2FIcons%2F33%20-%20Water%20Group.svg?alt=media&token=c33ca009-bfdd-4f1b-a9fb-9a3b6ad64829" alt="Delivery" className="w-7 h-7 object-contain" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{gallonsDisplay} Gallons Refill</p>
                    <p className="text-xs text-gray-500">{new Date(delivery.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
                <span className="font-bold text-gray-600">{delivery.amountLiters}L</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="animate-fade-in">
          <StationProfile />
        </div>
      )}
    </div>
  );
};

export default HistoryModalContent;
