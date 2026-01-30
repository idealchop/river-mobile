import React, { useState } from 'react';
import { IconCheckCircle, IconChevronLeft, IconChevronRight, IconWaterDrop, IconLaundry, IconCar, IconFlow } from './Icons.tsx';
import type { ServicePricing } from '../types.ts';

interface PricingTier {
  name: string;
  price?: string;
  annualPrice?: string;
  description: string;
  features: string[];
  isCurrent: boolean;
  cta: string;
  isCustom?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'FREE',
    price: '0',
    description: '30-day trial',
    features: ['200L Water/month', '5KG Laundry/cycle', 'Standard River AI', 'Basic Support', 'Limited Perks'],
    isCurrent: true,
    cta: 'Start Free Trial',
  },
  {
    name: 'Personal',
    price: '950',
    annualPrice: '9690', // Approx 15% discount
    description: 'For regular home use',
    features: ['600L Water/month', '15KG Laundry/cycle', 'Advanced River AI', 'Priority & Live Support', 'All Perks Unlocked'],
    isCurrent: false,
    cta: 'Switch to Personal',
  },
  {
    name: 'Family',
    price: '1799',
    annualPrice: '18350', // Approx 15% discount
    description: 'For larger households',
    features: ['1200L Water/month', '30KG Laundry/cycle', 'Advanced River AI', '24/7 Live Support', 'All Perks Unlocked'],
    isCurrent: false,
    cta: 'Switch to Family',
  },
  {
    name: 'Flow Plan',
    description: 'Pay based on service',
    features: ['Pay-per-use Water', 'Pay-per-use Laundry', 'Pay-per-use Car Wash', 'Standard River AI'],
    isCurrent: false,
    cta: 'View Pricing',
    isCustom: true,
  },
];

const servicePricing: ServicePricing[] = [
    { name: 'Water Refill', price: '50', unit: 'per 20L', icon: IconWaterDrop },
    { name: 'Laundry Service', price: '25', unit: 'per KG', icon: IconLaundry },
    { name: 'Car Wash', price: '200', unit: 'per wash', icon: IconCar },
];

const ANNUAL_DISCOUNT_PERCENT = 15;

const PricingScreen: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(pricingTiers.findIndex(t => t.isCurrent) || 0);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [view, setView] = useState<'carousel' | 'flow_pricing'>('carousel');

  const nextTier = () => {
    setCurrentIndex(prev => (prev + 1) % pricingTiers.length);
  };

  const prevTier = () => {
    setCurrentIndex(prev => (prev - 1 + pricingTiers.length) % pricingTiers.length);
  };

  const renderCarousel = () => (
    <>
      <div className="flex justify-center mb-6">
        <div className="relative flex items-center bg-gray-200 rounded-full p-1">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`relative z-10 px-4 py-1 text-sm font-semibold rounded-full transition-colors ${billingCycle === 'monthly' ? 'text-blue-600' : 'text-gray-500'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`relative z-10 px-4 py-1 text-sm font-semibold rounded-full transition-colors ${billingCycle === 'annual' ? 'text-blue-600' : 'text-gray-500'}`}
          >
            Annual
            <span className="absolute -top-2 -right-3 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              Save {ANNUAL_DISCOUNT_PERCENT}%
            </span>
          </button>
          <div
            className="absolute top-1 bottom-1 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out"
            style={{
              width: 'calc(50% - 4px)',
              transform: billingCycle === 'monthly' ? 'translateX(4px)' : `translateX(calc(100% - 2px))`,
            }}
          ></div>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {pricingTiers.map(tier => {
            const isCurrentPlan = tier.isCurrent && billingCycle === 'monthly';
            const displayPrice = billingCycle === 'annual' && tier.annualPrice ? tier.annualPrice : tier.price;
            const displayPeriod = billingCycle === 'annual' ? '/year' : '/month';

            return (
              <div key={tier.name} className="w-full flex-shrink-0 px-1 py-2">
                <div className={`rounded-2xl p-6 border-2 transition-all duration-300 h-full flex flex-col ${isCurrentPlan ? 'bg-blue-500 text-white border-transparent shadow-lg shadow-blue-500/30' : 'bg-white border-gray-200'}`}>
                  <h3 className="text-lg font-bold">{tier.name}</h3>
                  <div className="mt-2">
                    {displayPrice !== undefined ? (
                      <p>
                        <span className="text-4xl font-extrabold">₱{displayPrice}</span>
                        {tier.name !== 'FREE' && (
                           <span className={`text-sm ${isCurrentPlan ? 'text-blue-200' : 'text-gray-500'}`}>{displayPeriod}</span>
                        )}
                      </p>
                    ) : (
                       <p className="text-2xl font-extrabold h-[48px] flex items-center">Pay-per-use</p>
                    )}
                    <p className={`text-sm mt-1 h-5 ${isCurrentPlan ? 'text-blue-100' : 'text-gray-500'}`}>{tier.description}</p>
                  </div>
                  <ul className="mt-6 space-y-3 flex-grow">
                    {tier.features.map(feature => (
                      <li key={feature} className="flex items-center gap-3">
                        <IconCheckCircle className={`w-5 h-5 flex-shrink-0 ${isCurrentPlan ? 'text-white' : 'text-blue-500'}`} />
                        <span className={`text-sm ${isCurrentPlan ? '' : 'text-gray-700'}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => tier.isCustom && setView('flow_pricing')} className={`w-full mt-8 py-3 rounded-lg font-bold transition-colors ${isCurrentPlan ? 'bg-white text-blue-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>
                    {isCurrentPlan ? 'Current Plan' : tier.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center mt-6 space-x-6">
        <button onClick={prevTier} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors" aria-label="Previous plan">
          <IconChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div className="flex items-center space-x-2">
          {pricingTiers.map((_, index) => (
            <button 
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-blue-500 scale-125' : 'bg-gray-300'}`}
              aria-label={`Go to plan ${index + 1}`}
            />
          ))}
        </div>
        <button onClick={nextTier} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors" aria-label="Next plan">
          <IconChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </>
  );

  const renderFlowPricing = () => (
    <div className="animate-fade-in">
        <button onClick={() => setView('carousel')} className="flex items-center gap-1 text-sm text-blue-600 font-semibold mb-4">
            <IconChevronLeft className="w-4 h-4" />
            Back to Plans
        </button>
        <h3 className="text-lg font-bold text-center mb-4">Flow Plan Pricing</h3>
        <div className="space-y-3">
            {servicePricing.map(service => {
                const Icon = service.icon;
                return (
                    <div key={service.name} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Icon className="w-6 h-6 text-blue-500" />
                            <span className="font-semibold">{service.name}</span>
                        </div>
                        <div className="text-right">
                            <p className="font-bold">₱{service.price}</p>
                            <p className="text-xs text-gray-500">{service.unit}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col font-sans text-[var(--accent-color)]">
      {view === 'carousel' ? renderCarousel() : renderFlowPricing()}
    </div>
  );
};

export default PricingScreen;
