import React from 'react';

interface HealthBarProps {
  current: number;
  max: number;
}

export function HealthBar({ current, max }: HealthBarProps) {
  const percentage = (current / max) * 100;
  return (
    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full bg-red-500 transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}