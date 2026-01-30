
import { useState } from 'react';
import type { LogEntry } from '../types.ts';

interface UseWaterGaugeProps {
  totalLiters: number;
  initialLiters: number;
}

export const useWaterGauge = ({ totalLiters, initialLiters }: UseWaterGaugeProps) => {
  const [currentLiters, setCurrentLiters] = useState(initialLiters);
  const [log, setLog] = useState<LogEntry[]>([]);

  const percentage = Math.round((currentLiters / totalLiters) * 100);
  
  let levelStatus = "Medium";
  if (percentage > 75) {
    levelStatus = "High";
  } else if (percentage < 25) {
    levelStatus = "Low";
  }
  const statusText = `Level | ${levelStatus}`;
  
  const literText = `${currentLiters}L / ${totalLiters}L`;

  const logAction = (action: 'Added' | 'Consumed', amount: number) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLog(prevLog => [{ time, action, amount }, ...prevLog]);
  };

  const incrementLevel = (amount = 50) => {
    setCurrentLiters(prev => Math.min(totalLiters, prev + amount));
    logAction('Added', amount);
  };

  const decrementLevel = (amount = 25) => {
    setCurrentLiters(prev => Math.max(0, prev - amount));
    logAction('Consumed', amount);
  };

  return {
    percentage,
    statusText,
    literText,
    log,
    incrementLevel,
    decrementLevel,
    currentLiters,
    totalLiters,
  };
};
