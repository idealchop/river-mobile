import React from 'react';
import { useView } from '../App.tsx';
import { IconChevronLeft, IconMoodSmile, IconWoman, IconMan, IconLanguage, IconAdjustmentsHorizontal } from './Icons.tsx';
import type { AIPersonality, HumorLevel, AIVoice, AITone, AILanguage } from '../types.ts';

const CustomizeAIScreen: React.FC = () => {
  const { setCurrentView, aiPersonality, setAiPersonality } = useView();

  const handleUpdate = <K extends keyof AIPersonality>(key: K, value: AIPersonality[K]) => {
    setAiPersonality(prev => ({ ...prev, [key]: value }));
  };

  const OptionGroup = ({ title, icon: Icon, children }: { title: string, icon: React.FC<any>, children: React.ReactNode }) => (
    <div className="bg-white p-4 rounded-2xl shadow-sm">
      <h3 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2"><Icon className="w-5 h-5" /> {title}</h3>
      <div className="grid grid-cols-3 gap-2 bg-gray-100 p-1 rounded-xl">
        {children}
      </div>
    </div>
  );

  const OptionButton = ({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`px-2 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive ? 'bg-white shadow' : 'text-gray-600'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full h-full bg-gray-100 flex flex-col font-sans">
      <header className="p-4 flex items-center flex-shrink-0 bg-gray-100/80 backdrop-blur-lg sticky top-0 z-10">
        <button onClick={() => setCurrentView('river-ai')} className="p-2 -ml-2">
          <IconChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 absolute left-1/2 -translate-x-1/2">
          Customize AI
        </h1>
      </header>

      <main className="flex-grow overflow-y-auto px-4 py-6 space-y-8">
        <div className="space-y-6">
          <OptionGroup title="Humor Level" icon={IconMoodSmile}>
            {(['None', 'Low', 'High'] as HumorLevel[]).map(level => (
              <OptionButton key={level} label={level} isActive={aiPersonality.humor === level} onClick={() => handleUpdate('humor', level)} />
            ))}
          </OptionGroup>

          <OptionGroup title="Voice" icon={IconWoman}>
            {(['Female', 'Male'] as AIVoice[]).map(voice => (
              <OptionButton key={voice} label={voice} isActive={aiPersonality.voice === voice} onClick={() => handleUpdate('voice', voice)} />
            ))}
          </OptionGroup>

          <OptionGroup title="Tone" icon={IconAdjustmentsHorizontal}>
            {(['Friendly', 'Moderate', 'Straightforward'] as AITone[]).map(tone => (
              <OptionButton key={tone} label={tone} isActive={aiPersonality.tone === tone} onClick={() => handleUpdate('tone', tone)} />
            ))}
          </OptionGroup>

          <OptionGroup title="Language" icon={IconLanguage}>
            {(['English', 'Tagalog', 'Auto-detect'] as AILanguage[]).map(lang => (
              <OptionButton key={lang} label={lang} isActive={aiPersonality.language === lang} onClick={() => handleUpdate('language', lang)} />
            ))}
          </OptionGroup>
        </div>
      </main>
    </div>
  );
};

export default CustomizeAIScreen;
