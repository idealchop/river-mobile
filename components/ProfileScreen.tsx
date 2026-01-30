import React, { useState } from 'react';
import { 
    IconChevronLeft, 
    IconChevronRight, 
    IconUser, 
    IconBell,
    IconShoppingBag,
    IconShield, 
    IconEye,
} from './Icons.tsx';
import SettingsModal from './SettingsModal.tsx';
import { useView } from '../App.tsx';
import type { ProfileModalType } from '../types.ts';
import RiverCard from './RiverCard.tsx';
import NotificationPreferences from './NotificationPreferences.tsx';
import Toast from './Toast.tsx';

interface ProfileScreenProps {
  onLogout: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout }) => {
  const { setCurrentView, activeProfileModal, setActiveProfileModal } = useView();
  const [user] = useState({
    clientId: 'SC2500000007',
    email: 'jimbs.work@gmail.com',
  });
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleCloseModal = () => {
    setActiveProfileModal(null);
  }

  const handleSaveNotificationPrefs = (prefs: Record<string, boolean>) => {
    console.log('Saving notification preferences:', prefs);
    setToastMessage('Notification preferences saved!');
    setShowToast(true);
    handleCloseModal();
  };

  const renderModalContent = () => {
    switch (activeProfileModal) {
      case 'notifications':
        return <NotificationPreferences email={user.email} onSave={handleSaveNotificationPrefs} />;
      case 'marketing':
        return <NotificationPreferences email={user.email} onSave={handleSaveNotificationPrefs} />;
      default:
        return null;
    }
  };
  
  const getModalTitle = () => {
      switch(activeProfileModal) {
          case 'notifications': return 'Notification Preferences';
          case 'marketing': return 'Marketing Preferences';
          default: return '';
      }
  }

  const settingsSections = [
    {
      title: 'Communications',
      items: [
        { label: 'Contact info', icon: IconUser, action: () => setCurrentView('settings-contact') },
        { label: 'Notification preferences', icon: IconBell, action: () => setActiveProfileModal('notifications') },
        { label: 'Marketing preferences', icon: IconShoppingBag, action: () => setActiveProfileModal('marketing') },
      ]
    },
    {
      title: 'Account info',
      items: [
        { label: 'Login and security', icon: IconShield, action: () => setCurrentView('settings-security') },
        { label: 'Data and privacy', icon: IconEye, action: () => setCurrentView('settings-privacy') },
      ]
    }
  ];

  return (
    <>
      <div className="w-full h-full bg-[var(--new-bg)] flex flex-col font-sans text-[var(--accent-color)] relative">
        <header className="p-4 flex justify-between items-center flex-shrink-0">
          <button onClick={() => setCurrentView('dashboard')} className="p-2"><IconChevronLeft className="w-6 h-6" /></button>
          <h1 className="text-lg font-semibold">Settings</h1>
          <div className="w-10"></div>
        </header>

        <main className="flex-grow overflow-y-auto px-4 space-y-8 pb-6">
          <div className="px-2">
              <RiverCard clientId={user.clientId} />
          </div>

          {settingsSections.map(section => (
            <div key={section.title} className="px-2">
              <h2 className="text-lg font-bold text-gray-800 mb-2">{section.title}</h2>
              <div className="bg-white rounded-2xl shadow-sm">
                <div className="divide-y divide-gray-100">
                  {section.items.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <button 
                        key={item.label} 
                        onClick={item.action} 
                        className={`w-full flex justify-between items-center text-left p-4 hover:bg-gray-50 transition-colors
                          ${index === 0 ? 'rounded-t-2xl' : ''} 
                          ${index === section.items.length - 1 ? 'rounded-b-2xl' : ''}`}
                      >
                        <div className="flex items-center gap-4">
                          <Icon className="w-6 h-6 text-gray-500" />
                          <span className="font-semibold">{item.label}</span>
                        </div>
                        <IconChevronRight className="w-5 h-5 text-gray-400" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          <div className="pt-4 px-2">
              <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 font-bold py-3 px-4 rounded-2xl hover:bg-gray-100 border border-gray-200 transition-colors">
                  <span>Close Your Account</span>
              </button>
          </div>
        </main>
        <SettingsModal isOpen={!!activeProfileModal} onClose={handleCloseModal} title={getModalTitle()}>
          {renderModalContent()}
        </SettingsModal>
      </div>
      <Toast message={toastMessage} show={showToast} onDismiss={() => setShowToast(false)} />
    </>
  );
};

export default ProfileScreen;
