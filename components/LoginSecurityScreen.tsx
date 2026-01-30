import React, { useState } from 'react';
import { useView } from '../App.tsx';
import { IconChevronLeft, IconPasskey } from './Icons.tsx';
import SimpleToggle from './SimpleToggle.tsx';

const LoginSecurityScreen: React.FC = () => {
  const { setCurrentView } = useView();
  const [useFaceId, setUseFaceId] = useState(true);
  const [extendSession, setExtendSession] = useState(true);

  return (
    <div className="w-full h-full bg-gray-100 flex flex-col font-sans">
      <header className="p-4 flex items-center flex-shrink-0 bg-gray-100/80 backdrop-blur-lg sticky top-0 z-10">
        <button onClick={() => setCurrentView('profile')} className="p-2 -ml-2">
          <IconChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 absolute left-1/2 -translate-x-1/2">
          Login and security
        </h1>
      </header>

      <main className="flex-grow overflow-y-auto px-4 py-6 space-y-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <button className="w-full flex items-center gap-4 text-left">
            <IconPasskey className="w-6 h-6 text-gray-600" />
            <div>
              <h3 className="font-semibold text-gray-800">Passkey</h3>
              <p className="text-sm text-gray-500">Seamlessly log in using your fingerprint, face, or PIN.</p>
            </div>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
          <div className="p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-800">Face ID</h3>
              <p className="text-sm text-gray-500">Add Face ID for faster login.</p>
            </div>
            <SimpleToggle 
              checked={useFaceId} 
              onChange={setUseFaceId} 
              aria-label="Toggle Face ID"
            />
          </div>
          <div className="p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-800">Extend your login session</h3>
              <p className="text-sm text-gray-500 max-w-xs">Your account is eligible for longer logged-in sessions for activities you do often.</p>
            </div>
            <SimpleToggle 
              checked={extendSession} 
              onChange={setExtendSession}
              aria-label="Toggle extend login session"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginSecurityScreen;
