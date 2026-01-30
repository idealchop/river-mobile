import React, { useState } from 'react';
import { useView } from '../App.tsx';
import { IconChevronLeft, IconFileDownload, IconTrash, IconAdjustmentsHorizontal, IconHistory, IconChevronRight } from './Icons.tsx';
import Toast from './Toast.tsx';

const DataPrivacyScreen: React.FC = () => {
  const { setCurrentView } = useView();
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleOptionClick = (title: string) => {
    // Simulate action
    let message = '';
    if (title.includes('Download')) {
      message = 'Your data download has been initiated. It will be sent to your email.';
    } else if (title.includes('Delete')) {
      message = 'Data deletion request sent. This is irreversible.';
    } else {
      message = `${title} settings will be available soon.`;
    }
    setToastMessage(message);
    setShowToast(true);
  };

  const privacyOptions = [
    { 
      title: 'Manage your data', 
      description: 'Control what data is saved in your account.', 
      icon: IconAdjustmentsHorizontal 
    },
    { 
      title: 'Download your data', 
      description: 'Get a copy of your data to use with another service.', 
      icon: IconFileDownload 
    },
    { 
      title: 'Delete your data', 
      description: 'Permanently delete your account and data.', 
      icon: IconTrash 
    },
    { 
      title: 'Activity history', 
      description: 'See your past activity and interactions.', 
      icon: IconHistory 
    },
  ];

  return (
    <>
      <div className="w-full h-full bg-gray-100 flex flex-col font-sans">
        <header className="p-4 flex items-center flex-shrink-0 bg-gray-100/80 backdrop-blur-lg sticky top-0 z-10">
          <button onClick={() => setCurrentView('profile')} className="p-2 -ml-2">
            <IconChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800 absolute left-1/2 -translate-x-1/2">
            Data & privacy
          </h1>
        </header>

        <main className="flex-grow overflow-y-auto px-4 py-6 space-y-8">
          <div className="px-2">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Your data, your choices</h2>
            <p className="text-sm text-gray-600">Your data helps us make our services more useful to you. You can review and adjust your privacy settings anytime. We are committed to keeping your data safe and secure.</p>
          </div>
          
          <div className="space-y-3 px-2">
            {privacyOptions.map(option => (
              <button key={option.title} onClick={() => handleOptionClick(option.title)} className="w-full flex items-center justify-between text-left p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <option.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{option.title}</h3>
                    <p className="text-xs text-gray-500">{option.description}</p>
                  </div>
                </div>
                <IconChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
          <div className="mt-8 text-center px-2">
            <a href="#" className="text-sm text-blue-600 font-semibold hover:underline">Read our full Privacy Policy</a>
          </div>
        </main>
      </div>
      <Toast message={toastMessage} show={showToast} onDismiss={() => setShowToast(false)} />
    </>
  );
};

export default DataPrivacyScreen;
