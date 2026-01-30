import React from 'react';
import { IconCircle, IconTruck, IconCheckCircle } from './Icons.tsx';
import type { LaundryPickupStatus } from '../types.ts';

interface StatusItemProps {
  icon: React.ReactNode;
  title: string;
  time: string | null;
  details?: string | null;
  isCompleted: boolean;
  isCurrent: boolean;
  isLast: boolean;
}

const StatusItem: React.FC<StatusItemProps> = ({ icon, title, time, details, isCompleted, isCurrent, isLast }) => {
  let iconContainerClass = 'bg-gray-200 text-gray-400';
  let titleClass = 'font-semibold text-gray-500';
  let lineClass = 'bg-gray-200';

  if (isCompleted) {
    iconContainerClass = 'bg-blue-500 text-white';
    titleClass = 'font-bold text-gray-800';
    lineClass = 'bg-blue-500';
  } else if (isCurrent) {
    iconContainerClass = 'bg-blue-500 text-white ring-4 ring-blue-200';
    titleClass = 'font-bold text-gray-800';
  }

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${iconContainerClass}`}>
          {icon}
        </div>
        {!isLast && <div className={`w-0.5 flex-grow my-1 transition-colors duration-300 ${lineClass}`}></div>}
      </div>
      <div className="pb-6">
        <p className={`${titleClass} transition-colors duration-300`}>{title}</p>
        {time && <p className="text-xs text-gray-400">{time}</p>}
        {details && isCompleted && <p className="text-sm font-semibold text-green-600 mt-1 animate-fade-in">{details}</p>}
      </div>
    </div>
  );
};

const PickupStatusTracker: React.FC<{ status: LaundryPickupStatus }> = ({ status }) => {
  const stageConfig = [
    { name: 'requested', title: 'Pickup Requested', icon: <IconCircle className="w-5 h-5" />, time: status.requestedAt },
    { name: 'on-the-way', title: 'Driver On The Way', icon: <IconTruck className="w-5 h-5" />, time: status.onTheWayAt },
    { name: 'completed', title: 'Pickup Completed', icon: <IconCheckCircle className="w-5 h-5" />, time: status.completedAt, details: status.weight ? `${status.weight} KG Collected` : null },
  ];

  const currentStageIndex = stageConfig.findIndex(s => s.name === status.stage);

  return (
    <div className="p-4 bg-gray-50 rounded-xl">
      <h3 className="font-bold text-lg mb-4 text-gray-800">Pickup Status</h3>
      <div>
        {stageConfig.map((stage, index) => {
          const isCompleted = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;
          
          return (
            <StatusItem
              key={stage.name}
              icon={isCompleted ? <IconCheckCircle className="w-5 h-5" /> : stage.icon}
              title={stage.title}
              time={stage.time ? stage.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null}
              details={stage.name === 'completed' ? stage.details : null}
              isCompleted={isCompleted || (isCurrent && stage.name === 'completed')}
              isCurrent={isCurrent}
              isLast={index === stageConfig.length - 1}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PickupStatusTracker;
