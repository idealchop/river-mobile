
import React, { useState } from 'react';
import { IconCalendarDays, IconUserGroup } from './Icons.tsx';
import type { Gym, Coach, TrainingSession } from '../types.ts';

interface ScheduleTrainingModalProps {
  selectedGym: Gym | null;
  onSchedule: (session: Omit<TrainingSession, 'id'>) => void;
}

const ScheduleTrainingModal: React.FC<ScheduleTrainingModalProps> = ({ selectedGym, onSchedule }) => {
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSchedule = () => {
    if (selectedGym && selectedCoach && date && time) {
      onSchedule({
        gymId: selectedGym.id,
        coachId: selectedCoach.id,
        date,
        time,
      });
    }
  };

  if (!selectedGym) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">Please select a Fitness Center first from the 'Fitness Center' option.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold">{selectedGym.name}</h3>
        <p className="text-sm text-gray-500">Select a coach and schedule your session.</p>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-500 flex items-center gap-2"><IconUserGroup className="w-5 h-5" /> Select a Coach</label>
        <div className="mt-2 grid grid-cols-2 gap-4">
          {selectedGym.coaches.map(coach => (
            <button 
              key={coach.id}
              onClick={() => setSelectedCoach(coach)}
              className={`p-3 rounded-lg border-2 text-center transition-all ${selectedCoach?.id === coach.id ? 'bg-blue-100 border-blue-500' : 'bg-gray-100 border-transparent'}`}
            >
              <img src={coach.imageUrl} alt={coach.name} className="w-16 h-16 rounded-full mx-auto mb-2" />
              <p className="font-bold text-sm">{coach.name}</p>
              <p className="text-xs text-gray-500">{coach.specialty}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-500 flex items-center gap-2"><IconCalendarDays className="w-5 h-5" /> Select Date & Time</label>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 bg-gray-100 border border-gray-200 rounded-lg" />
          <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full p-2 bg-gray-100 border border-gray-200 rounded-lg" />
        </div>
      </div>

      <button 
        onClick={handleSchedule}
        disabled={!selectedCoach || !date || !time}
        className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-xl disabled:bg-gray-300"
      >
        Schedule Session
      </button>
    </div>
  );
};

export default ScheduleTrainingModal;
