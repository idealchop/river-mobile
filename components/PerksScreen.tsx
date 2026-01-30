import React, { useState } from 'react';
import { useView } from '../App.tsx';
import { IconChevronLeft, IconGift, IconCar, IconLaundry, IconCheckCircle, IconFitness, IconTicket, IconSparkles, IconMapPin } from './Icons.tsx';
import type { Perk, Partner } from '../types.ts';

const initialPerks: Perk[] = [
  { id: '1', title: 'First Month Free', description: 'Your first month of River service is on us!', icon: IconGift, claimed: true, gradient: 'from-green-400 to-teal-400' },
  { id: '2', title: 'Free Car Wash', description: 'A complimentary premium car wash.', icon: IconCar, claimed: false, gradient: 'from-blue-400 to-cyan-400', partners: [{ name: 'Sparkle Car Wash', location: '123 Shine St.' }] },
  { id: '3', title: 'Laundry Credit', description: '₱250 credit for your next laundry cycle.', icon: IconLaundry, claimed: false, gradient: 'from-indigo-400 to-purple-400', partners: [{ name: 'Fresh Folds Laundry', location: '456 Clean Ave.' }] },
  { id: '4', title: 'Fitness Pass', description: 'One free day-pass at our partner gym.', icon: IconFitness, claimed: false, gradient: 'from-orange-400 to-red-400', partners: [{ name: 'Flex Fitness', location: '789 Muscle Blvd.' }, { name: 'Zen Yoga Studio', location: '101 Peace Rd.' }] },
  { id: '5', title: 'Partner Discount', description: '15% off at local partner cafes.', icon: IconTicket, claimed: false, gradient: 'from-pink-500 to-rose-500', partners: [{ name: 'Cafe Nero', location: '123 Main St.' }, { name: 'The Coffee Bean', location: '456 Oak Ave.' }, { name: 'Starbucks', location: '789 Pine Ln.' }] },
  { id: '6', title: 'Early Access', description: 'Get early access to new River features.', icon: IconSparkles, claimed: true, gradient: 'from-yellow-400 to-amber-500' },
];

const PerkCard: React.FC<{ perk: Perk; onClaim: (id: string) => void; }> = ({ perk, onClaim }) => {
  const [view, setView] = useState<'description' | 'partners' | 'location'>('description');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  const handleViewPartners = () => setView('partners');
  const handleSelectPartner = (partner: Partner) => {
    setSelectedPartner(partner);
    setView('location');
  };
  const handleBack = () => {
    if (view === 'location') setView('partners');
    else if (view === 'partners') setView('description');
  };

  const Icon = perk.icon;

  const renderContent = () => {
    switch (view) {
      case 'location':
        return (
          <div className="flex flex-col items-center text-center">
            <IconMapPin className="w-8 h-8 text-blue-500 mb-2" />
            <p className="font-bold text-gray-800">{selectedPartner?.name}</p>
            <p className="text-sm text-gray-600">{selectedPartner?.location}</p>
            <button onClick={handleBack} className="text-xs text-blue-600 font-semibold hover:underline mt-2">Back to list</button>
          </div>
        );
      case 'partners':
        return (
          <div className="w-full">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-sm">Our Partners</h4>
              <button onClick={handleBack} className="text-xs text-blue-600 font-semibold hover:underline">Back</button>
            </div>
            <ul className="space-y-1">
              {perk.partners?.map(partner => (
                <li key={partner.name}>
                  <button onClick={() => handleSelectPartner(partner)} className="w-full text-left text-sm text-gray-700 p-1 hover:bg-gray-100 rounded">
                    {partner.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'description':
      default:
        return (
          <div className="flex-grow flex flex-col items-center text-center">
            <h3 className={`font-bold text-sm mb-1 ${perk.claimed ? 'text-gray-500' : 'text-gray-800'}`}>{perk.title}</h3>
            <p className={`text-xs flex-grow ${perk.claimed ? 'text-gray-400' : 'text-gray-500'}`}>{perk.description}</p>
            {perk.partners && !perk.claimed && (
              <button onClick={handleViewPartners} className="text-[10px] text-blue-600 font-semibold hover:underline mt-1">
                View Partners
              </button>
            )}
          </div>
        );
    }
  };

  return (
    <div className={`relative rounded-2xl p-4 flex flex-col items-center overflow-hidden transition-all duration-300 ${perk.claimed ? 'bg-gray-200' : 'bg-white shadow-md'}`}>
      <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-10 ${perk.gradient.split(' ')[0]}`}></div>
      <div className={`relative w-16 h-16 mb-3 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${perk.gradient}`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <div className="flex-grow flex flex-col items-center w-full min-h-[60px]">
        {renderContent()}
      </div>
      <div className="mt-4 w-full">
        {perk.claimed ? (
          <div className="flex items-center justify-center gap-1 text-green-600 font-semibold text-xs py-2 bg-green-100 rounded-full">
            <IconCheckCircle className="w-4 h-4" />
            <span>Claimed</span>
          </div>
        ) : (
          <button onClick={() => onClaim(perk.id)} className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-full text-xs hover:bg-blue-600 transition-colors">
            Claim
          </button>
        )}
      </div>
    </div>
  );
};

const PerksScreen: React.FC = () => {
  const { setCurrentView } = useView();
  const [perks, setPerks] = useState(initialPerks);

  const handleClaim = (id: string) => {
    setPerks(perks.map(p => p.id === id ? { ...p, claimed: true } : p));
  };

  return (
    <div className="w-full h-full bg-[var(--new-bg)] flex flex-col font-sans text-[var(--accent-color)]">
      <header className="p-4 flex justify-between items-center flex-shrink-0 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
        <button onClick={() => setCurrentView('dashboard')} className="p-2 -ml-2"><IconChevronLeft className="w-6 h-6" /></button>
        <h1 className="text-lg font-semibold">Your Perks</h1>
        <div className="w-8"></div>
      </header>

      <main className="flex-grow overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {perks.map(perk => (
            <PerkCard key={perk.id} perk={perk} onClaim={handleClaim} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default PerksScreen;
