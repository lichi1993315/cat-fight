import React from 'react';

interface EnergyBarProps {
  current: number;
  max: number;
}

export function EnergyBar({ current, max }: EnergyBarProps) {
  const percentage = (current / max) * 100;
  return (
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full bg-yellow-400 transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}