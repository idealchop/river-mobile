import React, { useMemo } from 'react';
import { useView } from '../App.tsx';
import { IconChevronLeft, IconTrendingUp, IconTrendingDown } from './Icons.tsx';
import ConsumptionChart from './ConsumptionChart.tsx';
import type { MonthlyConsumption } from '../types.ts';

const mockConsumption: MonthlyConsumption[] = [
  { month: 'Jan', liters: 350 },
  { month: 'Feb', liters: 410 },
  { month: 'Mar', liters: 380 },
  { month: 'Apr', liters: 420 },
  { month: 'May', liters: 390 },
];

const UsageScreen: React.FC = () => {
  const { setCurrentView } = useView();

  const insights = useMemo(() => {
    if (mockConsumption.length < 2) return null;

    const totalConsumption = mockConsumption.reduce((acc, curr) => acc + curr.liters, 0);
    const average = totalConsumption / mockConsumption.length;

    const lastMonth = mockConsumption[mockConsumption.length - 1];
    const secondLastMonth = mockConsumption[mockConsumption.length - 2];

    const percentageChange = ((lastMonth.liters - secondLastMonth.liters) / secondLastMonth.liters) * 100;

    return {
      average: Math.round(average),
      trend: percentageChange,
      lastMonthName: lastMonth.month,
      secondLastMonthName: secondLastMonth.month,
    };
  }, [mockConsumption]);

  const renderInsights = () => {
    if (!insights) return null;

    const isUp = insights.trend > 0;
    const trendColor = isUp ? 'text-red-500' : 'text-green-500';
    const TrendIcon = isUp ? IconTrendingUp : IconTrendingDown;

    return (
      <div className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isUp ? 'bg-red-100' : 'bg-green-100'}`}>
          <TrendIcon className={`w-6 h-6 ${trendColor}`} />
        </div>
        <div>
          <p className="text-sm text-gray-600">
            Your usage in {insights.lastMonthName} was 
            <span className={`font-bold ${trendColor}`}> {Math.abs(insights.trend).toFixed(0)}% {isUp ? 'higher' : 'lower'} </span> 
            than {insights.secondLastMonthName}.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Average monthly use is <span className="font-semibold">{insights.average}L</span>.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-[var(--new-bg)] flex flex-col font-sans text-[var(--accent-color)]">
      <header className="p-4 flex justify-between items-center flex-shrink-0 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
        <button onClick={() => setCurrentView('dashboard')} className="p-2 -ml-2"><IconChevronLeft className="w-6 h-6" /></button>
        <h1 className="text-lg font-semibold">Usage</h1>
        <div className="w-8"></div>
      </header>

      <main className="flex-grow overflow-y-auto p-6 space-y-6">
        <div>
            <h3 className="font-bold text-gray-700 mb-2">Quick Insights</h3>
            {renderInsights()}
        </div>
        <div>
            <h3 className="font-bold text-gray-700 mb-2">Monthly Consumption</h3>
            <ConsumptionChart data={mockConsumption} />
        </div>
      </main>
    </div>
  );
};

export default UsageScreen;
