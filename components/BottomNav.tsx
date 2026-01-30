import React, { useRef } from 'react';
import { IconHome, IconGift, IconUsage, IconSupport } from './Icons.tsx';
import { useView, AppView } from '../App.tsx';
import AnimatedRiverIcon from './AnimatedRiverIcon.tsx';

const NavItem: React.FC<{
  view: AppView;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  isActive: boolean;
  onClick: (view: AppView) => void;
}> = ({ view, label, icon: Icon, isActive, onClick }) => {
  return (
    <button onClick={() => onClick(view)} className="relative flex flex-col items-center justify-center w-16 h-16 focus:outline-none group" aria-label={label}>
      <Icon className={`w-6 h-6 transition-colors duration-300 ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-600'}`} />
    </button>
  );
};

const BottomNav: React.FC = () => {
  const { currentView, setCurrentView, setIsLiveConversationActive } = useView();
  const pressTimer = useRef<number | null>(null);
  const isLongPress = useRef(false);

  const handlePressStart = () => {
    isLongPress.current = false;
    pressTimer.current = window.setTimeout(() => {
      isLongPress.current = true;
      setIsLiveConversationActive(true);
    }, 200); // 200ms threshold for long press
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
    // If it was a long press, the modal is active. Releasing the button signals it to stop listening.
    if (isLongPress.current) {
      setIsLiveConversationActive(false);
    }
  };

  const handleClick = () => {
    // This function is a fallback for devices where mouse/touch events might not be perfectly distinguished.
    // The primary logic in handlePressEnd handles the short click.
    if (!isLongPress.current) {
      setCurrentView('river-ai');
    }
  };

  return (
    <div className="w-full h-24 relative">
      <div className="absolute bottom-0 left-0 right-0 h-[72px] bg-white/90 backdrop-blur-lg rounded-t-3xl shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
        <div className="flex justify-around items-center h-full">
          <div className="flex justify-around w-2/5">
            <NavItem 
              key='dashboard'
              view='dashboard'
              label='Home'
              icon={IconHome}
              isActive={currentView === 'dashboard'}
              onClick={setCurrentView}
            />
          </div>
          <div className="w-1/5"></div>
          <div className="flex justify-around w-2/5">
            <NavItem 
              key='support'
              view='support'
              label='Support'
              icon={IconSupport}
              isActive={currentView === 'support'}
              onClick={setCurrentView}
            />
          </div>
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
            <div className="w-32 h-1.5 bg-gray-200 rounded-full mx-auto"></div>
        </div>
      </div>
      <div className="absolute left-1/2 top-0 -translate-x-1/2">
        <button 
          onClick={handleClick}
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          onContextMenu={(e) => e.preventDefault()}
          className={`w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/40 ring-4 ring-white transition-all duration-300 ${currentView === 'river-ai' ? 'scale-110' : ''}`}
          aria-label="River AI"
        >
          <AnimatedRiverIcon />
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
