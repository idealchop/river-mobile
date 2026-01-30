import React, { useState } from 'react';
import { useWaterGauge } from '../hooks/useWaterGauge.ts';
import { useView } from '../App.tsx';
import { IconRefresh, IconClipboardList, IconLaundry, IconCar, IconFitness, IconWaterDrop, IconCalendarPlus, IconScale, IconSparkles, IconHeart, IconStopwatch, IconMenu } from './Icons.tsx';
import EtherealBackground from './EtherealBackground.tsx';
import Gauge from './Gauge.tsx';
import type { ServiceName, Service, ServiceControl, ManualRefillStatus, LaundryPickupStatus, Gym, TrainingSession } from '../types.ts';
import RefillSettingsModal from './RefillSettingsModal.tsx';
import ConfirmationModal from './ConfirmationModal.tsx';
import SettingsModal from './SettingsModal.tsx';
import LaundrySettingsModal from './LaundrySettingsModal.tsx';
import CarServiceModal from './CarServiceModal.tsx';
import VehicleSelectionModal from './VehicleSelectionModal.tsx';
import Toast from './Toast.tsx';
import HistoryModalContent from './HistoryModalContent.tsx';
import PricingScreen from './PricingScreen.tsx';
import LaundryScheduleModal from './LaundryScheduleModal.tsx';
import FitnessCenterModal from './FitnessCenterModal.tsx';
import ScheduleTrainingModal from './ScheduleTrainingModal.tsx';

const services: Service[] = [
  { id: 'water', name: 'Water', subtext: 'Monitor your main supply', icon: IconWaterDrop, controls: [
    { id: 'refill', label: 'Auto-Refill', icon: IconRefresh, isActive: true },
    { id: 'history', label: 'History', icon: IconClipboardList, isActive: false },
  ], gradient: 'from-blue-400 to-cyan-400'},
  { id: 'laundry', name: 'Laundry', subtext: 'Track your cycles', icon: IconLaundry, controls: [
    { id: 'schedule', label: 'Schedule', icon: IconCalendarPlus, isActive: true },
    { id: 'kg', label: 'Available KG', icon: IconScale, isActive: false },
  ], gradient: 'from-indigo-400 to-purple-400'},
  { id: 'car', name: 'Car', subtext: 'Manage wash credits', icon: IconCar, controls: [
    { id: 'vehicle', label: 'Vehicle', icon: IconCar, isActive: true },
    { id: 'service', label: 'Service', icon: IconSparkles, isActive: false },
  ], gradient: 'from-green-400 to-teal-400'},
  { id: 'fitness', name: 'Fitness', subtext: 'Log your hydration', icon: IconFitness, controls: [
    { id: 'progress', label: 'Fitness Center', icon: IconHeart, isActive: true },
    { id: 'schedule', label: 'Schedule', icon: IconStopwatch, isActive: false },
  ], gradient: 'from-orange-400 to-red-400'},
];

const ServicePlaceholder: React.FC<{
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  name: string;
}> = ({ icon: Icon, name }) => {
  return (
    <div className={`w-56 h-56 relative flex flex-col items-center justify-center text-gray-300`}>
      {Icon && <Icon className="w-24 h-24 opacity-50" />}
      <p className="text-2xl font-semibold mt-4 opacity-70">{name}</p>
      <p className="text-sm opacity-50">Data coming soon</p>
    </div>
  );
};

const DashboardScreen: React.FC = () => {
  const { setCurrentView, setIsSideNavOpen } = useView();
  const [activeService, setActiveService] = useState<ServiceName>('water');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isAutoRefillEnabled, setIsAutoRefillEnabled] = useState(true);
  const [refillFrequency, setRefillFrequency] = useState<'Weekly' | 'Twice-Week'>('Weekly');
  const [animationKey, setAnimationKey] = useState(0);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [manualRefillStatus, setManualRefillStatus] = useState<ManualRefillStatus | null>(null);
  const [isLaundryScheduleModalOpen, setIsLaundryScheduleModalOpen] = useState(false);
  const [isLaundryAutomated, setIsLaundryAutomated] = useState(true);
  const [laundryFrequency, setLaundryFrequency] = useState<'Weekly' | 'Bi-Weekly'>('Weekly');
  const [laundryPickupStatus, setLaundryPickupStatus] = useState<LaundryPickupStatus | null>(null);
  const [confirmedCarServices, setConfirmedCarServices] = useState<string[]>([]);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);

  const serviceData = {
    water: useWaterGauge({ totalLiters: 400, initialLiters: 200 }),
    laundry: useWaterGauge({ totalLiters: 10, initialLiters: 10 }), // Base KG for laundry
    car: useWaterGauge({ totalLiters: 250, initialLiters: 150 }),
    fitness: useWaterGauge({ totalLiters: 50, initialLiters: 20 }),
  };

  const activeServiceData = serviceData[activeService];
  const activeServiceInfo = services.find(s => s.id === activeService);

  const handleServiceChange = (serviceId: ServiceName) => {
    if (serviceId === activeService) return;
    setAnimationKey(prev => prev + 1);
    setActiveService(serviceId);
  };
  
  const user = { name: 'Alex Starr', imageUrl: "https://i.pravatar.cc/150?u=alex", plan: 'FREE' };
  const firstName = user.name.split(' ')[0];

  const handleControlClick = (controlId: string) => {
    if (activeService === 'water' && controlId === 'refill') {
      setIsSettingsOpen(true);
    } else if (activeService === 'laundry' && controlId === 'schedule') {
      setIsLaundryScheduleModalOpen(true);
    }
    else {
      setActiveModal(controlId);
    }
  };

  const handleRequestRefillNow = () => {
    const newStatus: ManualRefillStatus = { stage: 'requested', requestedAt: new Date() };
    setManualRefillStatus(newStatus);
    setToastMessage('Refill request sent!');
    setShowToast(true);
    setTimeout(() => setManualRefillStatus(prev => prev ? { ...prev, stage: 'in-progress', inProgressAt: new Date() } : null), 5000);
    setTimeout(() => {
      setManualRefillStatus(prev => {
        if (prev) {
          const completedStatus = { ...prev, stage: 'completed' as const, completedAt: new Date(), amount: 60 };
          serviceData.water.incrementLevel(completedStatus.amount);
          const gallons = completedStatus.amount / 20;
          setToastMessage(`Refill complete! ${gallons.toFixed(0)} Gallons added.`);
          setShowToast(true);
          return completedStatus;
        }
        return null;
      });
    }, 12000);
  };

  const handleRequestLaundryPickup = () => {
    const newStatus: LaundryPickupStatus = { stage: 'requested', requestedAt: new Date() };
    setLaundryPickupStatus(newStatus);
    setToastMessage('Laundry pickup requested!');
    setShowToast(true);
    setTimeout(() => setLaundryPickupStatus(prev => prev ? { ...prev, stage: 'on-the-way', onTheWayAt: new Date() } : null), 4000);
    setTimeout(() => {
      setLaundryPickupStatus(prev => prev ? { ...prev, stage: 'completed' as const, completedAt: new Date(), weight: 8.5 } : null);
      setToastMessage(`Pickup complete! 8.5 KG collected.`);
      setShowToast(true);
    }, 10000);
  };

  const handleSaveSettings = () => {
    setIsSettingsOpen(false);
    setIsLaundryScheduleModalOpen(false);
    setToastMessage('Settings saved successfully!');
    setShowToast(true);
  };

  const handleConfirmCarServices = (selected: string[]) => {
    setConfirmedCarServices(selected);
    if (selected.length > 0) {
      setToastMessage(`${selected.join(', ')} added to your next service.`);
    } else {
      setToastMessage('No extra car services selected.');
    }
    setShowToast(true);
  };

  const handleSelectGym = (gym: Gym) => {
    setSelectedGym(gym);
    setToastMessage(`${gym.name} selected as your partner gym.`);
    setShowToast(true);
    setActiveModal(null);
  };

  const handleScheduleTraining = (session: Omit<TrainingSession, 'id'>) => {
    const newSession = { ...session, id: `ts-${Date.now()}` };
    setTrainingSessions(prev => [...prev, newSession]);
    setToastMessage(`Training with ${selectedGym?.coaches.find(c => c.id === session.coachId)?.name} scheduled!`);
    setShowToast(true);
    setActiveModal(null);
  };

  const renderModalContent = () => {
    switch(activeModal) {
        case 'kg': return <LaundrySettingsModal onClose={() => setActiveModal(null)} availableKg={serviceData.laundry.totalLiters} />;
        case 'vehicle': return <VehicleSelectionModal onClose={() => setActiveModal(null)} />;
        case 'service': return <CarServiceModal onClose={() => setActiveModal(null)} onConfirm={handleConfirmCarServices} />;
        case 'progress': return <FitnessCenterModal onSelectGym={handleSelectGym} />;
        case 'schedule': return <ScheduleTrainingModal selectedGym={selectedGym} onSchedule={handleScheduleTraining} />;
        case 'history': return <HistoryModalContent />;
        default: return null;
    }
  };

  const getModalTitle = () => {
    return activeServiceInfo?.controls.find(c => c.id === activeModal)?.label || '';
  };

  const renderMainContent = () => {
    const animationClass = 'animate-slide-in-from-left';
    
    if (activeService === 'water') {
      return (
        <div key="water" className={`w-56 h-56 relative flex items-center justify-center ${animationClass}`}>
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <EtherealBackground />
          </div>
          <div className="absolute inset-0">
            <Gauge percentage={activeServiceData.percentage} />
          </div>
          <div className="relative text-center text-white flex flex-col items-center justify-center">
            <p className="text-sm opacity-80 font-medium">{activeServiceData.statusText}</p>
            <div className="flex items-start">
                <h2 className="text-7xl font-light tracking-tighter">{activeServiceData.percentage}</h2>
                <span className="text-xl font-light opacity-80 mt-2">%</span>
            </div>
            <p className="text-xs opacity-70 font-medium -mt-2">{activeServiceData.literText}</p>
          </div>
        </div>
      );
    }
    
    return (
      <ServicePlaceholder 
        key={activeService}
        icon={activeServiceInfo?.icon} 
        name={activeServiceInfo?.name || ''} 
      />
    );
  };

  return (
    <div className="w-full flex flex-col h-full">
      <header className="p-4 flex justify-between items-center flex-shrink-0 relative">
        <button onClick={() => setIsSideNavOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors" aria-label="Open navigation menu">
            <IconMenu className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold text-gray-800">Hello, {firstName}!</h1>
        <button onClick={() => setCurrentView('profile')} className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
            <img src={user.imageUrl} alt="User Profile" className="w-full h-full object-cover rounded-full" />
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-2 relative overflow-hidden">
        <div key={animationKey} className="animate-slide-in-from-left">
          {renderMainContent()}
        </div>
      </main>

      <div className="px-6 pb-4 flex-shrink-0">
        <div key={activeService} className="mb-4 flex items-center justify-center gap-6 flex-shrink-0">
            {activeServiceInfo?.controls.map(control => {
              const ControlIcon = control.icon;
              return (
                <button key={control.id} onClick={() => handleControlClick(control.id)} className={`flex items-center gap-2 text-xs font-bold ${control.isActive ? 'text-blue-500' : 'text-gray-500'}`}>
                  <ControlIcon className="w-5 h-5" /> {control.label}
                </button>
              );
            })}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <button 
                key={service.id} 
                onClick={() => handleServiceChange(service.id)}
                className={`relative h-40 rounded-3xl overflow-hidden shadow-lg transition-all duration-300 p-4 flex flex-col items-start justify-start text-left ${activeService === service.id ? 'ring-4 ring-blue-400' : ''}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient}`}></div>
                <div className="relative z-10">
                    <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center mb-4">
                        <Icon className="w-7 h-7 text-white" />
                    </div>
                    <p className="font-bold text-white text-base">{service.name}</p>
                    <p className="text-xs text-white/80 mt-1">{service.subtext}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      <Toast message={toastMessage} show={showToast} onDismiss={() => setShowToast(false)} />
      
      <RefillSettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
        isAutoRefillEnabled={isAutoRefillEnabled}
        setAutoRefillEnabled={setIsAutoRefillEnabled}
        frequency={refillFrequency}
        setFrequency={setRefillFrequency}
        onRequestNow={handleRequestRefillNow}
        averageConsumption={12.5}
        manualRefillStatus={manualRefillStatus}
      />
      <LaundryScheduleModal
        isOpen={isLaundryScheduleModalOpen}
        onClose={() => setIsLaundryScheduleModalOpen(false)}
        onSave={handleSaveSettings}
        isAutomated={isLaundryAutomated}
        setIsAutomated={setIsLaundryAutomated}
        frequency={laundryFrequency}
        setFrequency={setLaundryFrequency}
        onRequestNow={handleRequestLaundryPickup}
        pickupStatus={laundryPickupStatus}
      />
      <ConfirmationModal isOpen={isConfirmOpen} />
      <SettingsModal isOpen={!!activeModal} onClose={() => setActiveModal(null)} title={getModalTitle()}>
        {renderModalContent()}
      </SettingsModal>
    </div>
  );
};

export default DashboardScreen;
