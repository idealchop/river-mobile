import React, { useState, useCallback, createContext, useContext, useRef, useEffect } from 'react';
import LoginScreen from './components/LoginScreen.tsx';
import DashboardScreen from './components/DashboardScreen.tsx';
import ProfileScreen from './components/ProfileScreen.tsx';
import RiverAIScreen from './components/RiverAIScreen.tsx';
import BottomNav from './components/BottomNav.tsx';
import PerksScreen from './components/PerksScreen.tsx';
import UsageScreen from './components/UsageScreen.tsx';
import SupportScreen from './components/SupportScreen.tsx';
import { IconHome, IconGift, IconUsage, IconSettings, IconLogout, IconX } from './components/Icons.tsx';
import type { ProfileModalType, AIPersonality } from './types.ts';
import LiveConversationModal from './components/LiveConversationModal.tsx';
import CustomizeAIScreen from './components/CustomizeAIScreen.tsx';
import LoginSecurityScreen from './components/LoginSecurityScreen.tsx';
import DataPrivacyScreen from './components/DataPrivacyScreen.tsx';
import ContactInfoScreen from './components/ContactInfoScreen.tsx';

// 1. Define and export context and hook for view management
export type AppView = 'dashboard' | 'perks' | 'river-ai' | 'usage' | 'support' | 'profile' | 'settings-customize-ai' | 'settings-security' | 'settings-privacy' | 'settings-contact';

interface ViewContextType {
  currentView: AppView;
  setCurrentView: (view: AppView, profileModal?: ProfileModalType) => void;
  isSideNavOpen: boolean;
  setIsSideNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeProfileModal: ProfileModalType;
  setActiveProfileModal: React.Dispatch<React.SetStateAction<ProfileModalType>>;
  animationClass: string;
  isLiveConversationActive: boolean;
  setIsLiveConversationActive: React.Dispatch<React.SetStateAction<boolean>>;
  aiPersonality: AIPersonality;
  setAiPersonality: React.Dispatch<React.SetStateAction<AIPersonality>>;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export const useView = (): ViewContextType => {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
};

const SideNav: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { currentView, setCurrentView, isSideNavOpen, setIsSideNavOpen } = useView();
  const user = { name: 'Alex Starr', imageUrl: "https://i.pravatar.cc/150?u=alex" };

  const navItems = [
    { view: 'dashboard', label: 'Dashboard', icon: IconHome },
    { view: 'perks', label: 'Perks', icon: IconGift },
    { view: 'usage', label: 'Usage', icon: IconUsage },
    { view: 'profile', label: 'Settings', icon: IconSettings },
  ];

  const handleNavClick = (view: AppView) => {
    setCurrentView(view);
    setIsSideNavOpen(false);
  };
  
  const handleProfileClick = () => {
    setCurrentView('profile');
    setIsSideNavOpen(false);
  }

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isSideNavOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSideNavOpen(false)}
      ></div>
      <div 
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out rounded-r-3xl ${isSideNavOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full p-6">
          <header className="flex justify-between items-center mb-8">
            <button onClick={handleProfileClick} className="flex items-center gap-3 text-left">
              <img src={user.imageUrl} alt="User" className="w-12 h-12 rounded-full" />
              <div>
                <p className="font-bold text-lg text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500 hover:underline">View Settings</p>
              </div>
            </button>
            <button onClick={() => setIsSideNavOpen(false)} className="p-2 -mr-2">
              <IconX className="w-6 h-6 text-gray-500" />
            </button>
          </header>
          <nav className="flex-grow space-y-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.view;
              return (
                <button 
                  key={item.label} 
                  onClick={() => handleNavClick(item.view as AppView)}
                  className={`w-full flex items-center gap-4 p-3 rounded-lg text-left transition-colors ${isActive ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'text-blue-500' : 'text-gray-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          <footer className="mt-8">
            <button onClick={onLogout} className="w-full flex items-center gap-4 p-3 rounded-lg text-left text-red-500 hover:bg-red-50 transition-colors">
              <IconLogout className="w-6 h-6" />
              <span className="font-semibold">Logout</span>
            </button>
            <p className="text-center text-xs text-gray-400 mt-4">Version 1.0.0</p>
          </footer>
        </div>
      </div>
    </>
  );
};

const MainContent: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const { currentView, isSideNavOpen, animationClass } = useView();

    const renderContent = () => {
        switch (currentView) {
            case 'profile': return <ProfileScreen onLogout={onLogout} />;
            case 'river-ai': return <RiverAIScreen />;
            case 'perks': return <PerksScreen />;
            case 'usage': return <UsageScreen />;
            case 'support': return <SupportScreen />;
            case 'settings-customize-ai': return <CustomizeAIScreen />;
            case 'settings-security': return <LoginSecurityScreen />;
            case 'settings-privacy': return <DataPrivacyScreen />;
            case 'settings-contact': return <ContactInfoScreen />;
            case 'dashboard': default: return <DashboardScreen />;
        }
    };

    return (
        <div className={`w-full h-full flex flex-col bg-[var(--new-bg)] transition-transform duration-300 ease-in-out transform ${isSideNavOpen ? 'translate-x-72 rounded-l-3xl' : 'translate-x-0'}`}>
            {isSideNavOpen && <div className="absolute inset-0 z-50" onClick={() => useView().setIsSideNavOpen(false)}></div>}
            <div key={currentView} className={`flex-grow overflow-auto ${animationClass}`}>
                {renderContent()}
            </div>
            <footer className="w-full flex-shrink-0">
                <BottomNav />
            </footer>
        </div>
    );
};

const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, _setCurrentView] = useState<AppView>('dashboard');
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [activeProfileModal, setActiveProfileModal] = useState<ProfileModalType>(null);
  const [animationClass, setAnimationClass] = useState('animate-slide-in-from-right');
  const [isLiveConversationActive, setIsLiveConversationActive] = useState(false);
  const [aiPersonality, setAiPersonality] = useState<AIPersonality>({
    humor: 'Low',
    voice: 'Female',
    tone: 'Friendly',
    language: 'Auto-detect',
  });
  
  const prevView = usePrevious(currentView);

  const viewOrder: AppView[] = ['dashboard', 'perks', 'usage', 'river-ai', 'support', 'profile', 'settings-customize-ai', 'settings-security', 'settings-privacy', 'settings-contact'];

  const setCurrentView = useCallback((view: AppView, profileModal: ProfileModalType = null) => {
    const oldIndex = viewOrder.indexOf(prevView || 'dashboard');
    const newIndex = viewOrder.indexOf(view);

    if (newIndex > oldIndex) {
        setAnimationClass('animate-slide-in-from-right');
    } else if (newIndex < oldIndex) {
        setAnimationClass('animate-slide-in-from-left');
    } else {
        setAnimationClass('');
    }

    _setCurrentView(view);
    setActiveProfileModal(profileModal);
    if (view !== 'profile') {
        setActiveProfileModal(null);
    }
  }, [prevView]);

  const handleLogin = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setIsSideNavOpen(false);
  }, []);

  return (
    <div className="w-[390px] h-[844px] bg-neutral-800 rounded-[60px] shadow-2xl p-3.5 border-2 border-neutral-700 relative z-10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-neutral-800 rounded-b-2xl z-20"></div>
      <div className="w-full h-full bg-white rounded-[40px] overflow-hidden flex flex-col font-sans transform relative overflow-x-hidden">
        {isLoggedIn ? (
          <ViewContext.Provider value={{ currentView, setCurrentView, isSideNavOpen, setIsSideNavOpen, activeProfileModal, setActiveProfileModal, animationClass, isLiveConversationActive, setIsLiveConversationActive, aiPersonality, setAiPersonality }}>
            <SideNav onLogout={handleLogout} />
            <MainContent onLogout={handleLogout} />
            <LiveConversationModal />
          </ViewContext.Provider>
        ) : (
          <LoginScreen onLogin={handleLogin} />
        )}
      </div>
    </div>
  );
}
