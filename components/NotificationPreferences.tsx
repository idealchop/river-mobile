import React, { useState } from 'react';
import ToggleSwitch from './ToggleSwitch.tsx';

interface NotificationPreferencesProps {
  email: string;
  onSave: (prefs: Record<string, boolean>) => void;
}

const preferenceItems = [
  {
    key: 'news',
    title: 'News',
    description: 'We\'ll send important info about our products and benefits to help you get the most from your account.',
  },
  {
    key: 'offers',
    title: 'Offers',
    description: 'From travel to technology and fashion to food, we\'ll send discounts and offers from our partner brands.',
  },
  {
    key: 'surveys',
    title: 'Surveys',
    description: 'From time to time, we\'ll invite you to share your opinions. By taking part, you can help us create an even better River.',
  },
  {
    key: 'developer',
    title: 'Developer updates',
    description: 'Get the latest River developer news and promotions.',
  },
];

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({ email, onSave }) => {
  const [preferences, setPreferences] = useState({
    news: true,
    offers: true,
    surveys: true,
    developer: false,
  });

  const handleToggle = (key: string) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleUnsubscribeAll = () => {
    const allOff = Object.keys(preferences).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {} as Record<string, boolean>);
    setPreferences(allOff);
  };

  return (
    <div className="flex flex-col h-full bg-white p-4 rounded-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Notification Preferences</h2>
        <p className="text-sm text-gray-500 mt-1">{email}</p>
        <p className="text-sm text-gray-600 mt-4 max-w-xs mx-auto">
          We'll send info that's relevant to you. You can choose what you'd like to get from us and how we should send it.
        </p>
      </div>

      <div className="flex-grow space-y-2 overflow-y-auto -mx-4 px-4">
        <h3 className="font-semibold text-gray-700 mb-2 px-4">You're receiving:</h3>
        {preferenceItems.map((item, index) => (
          <div key={item.key} className={`bg-white p-4 ${index !== 0 ? 'border-t border-gray-200' : ''}`}>
            <h4 className="font-bold text-gray-800">{item.title}</h4>
            <p className="text-sm text-gray-600 mt-1 mb-3">{item.description}</p>
            <div className="flex items-center gap-3">
              <ToggleSwitch
                checked={preferences[item.key as keyof typeof preferences]}
                onChange={() => handleToggle(item.key)}
              />
              <span className="text-sm font-semibold text-gray-700">Email</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex-shrink-0 space-y-3 border-t border-gray-200 pt-6 -mx-4 px-4">
        <button
          onClick={() => onSave(preferences)}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-full hover:bg-blue-700 transition-colors"
        >
          Save
        </button>
        <button
          onClick={handleUnsubscribeAll}
          className="w-full bg-transparent text-blue-600 font-bold py-3 px-4 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
        >
          Unsubscribe from all
        </button>
      </div>
    </div>
  );
};

export default NotificationPreferences;
