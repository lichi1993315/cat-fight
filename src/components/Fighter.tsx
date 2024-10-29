import React from 'react';
import { HealthBar } from './HealthBar';
import { EnergyBar } from './EnergyBar';
import { SkillBar } from './SkillBar';
import { Fighter as FighterType } from '../types';
import whitecat from '../assets/icons/white-cat.png';
import blackcat from '../assets/icons/black-cat.png';

interface FighterProps {
  fighter: FighterType;
  isBlack?: boolean;
  isAttacking: boolean;
  isGettingHit: boolean;
  isCrit: boolean;
  isMotivated?: boolean;
  activeSkill?: string | null;
}

export function Fighter({ 
  fighter, 
  isBlack, 
  isAttacking, 
  isGettingHit, 
  isCrit, 
  isMotivated,
  activeSkill 
}: FighterProps) {
  return (
    <div className={`
      flex flex-col items-center gap-3 transition-transform duration-150
      ${isAttacking ? 'scale-110' : ''}
      ${isGettingHit ? 'animate-shake' : ''}
      ${isMotivated ? 'animate-bounce' : ''}
      relative px-20
    `}>
      {activeSkill && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold">
            {activeSkill}
          </span>
        </div>
      )}
      
      <div className={`text-xl font-bold ${isBlack ? 'text-gray-800' : 'text-gray-600'}`}>
        {fighter.name}
        {isMotivated && <span className="ml-2">⚡</span>}
      </div>

      <div className="relative">
        <SkillBar
          skills={fighter.skills}
          cooldowns={fighter.skillCooldowns}
          energy={fighter.energy}
          align={isBlack ? 'right' : 'left'}
        />
        
        <div className={`
          w-32 h-32 flex items-center justify-center rounded-full relative overflow-hidden
          ${isBlack ? 'bg-gray-800' : 'bg-gray-200'}
          ${isGettingHit ? 'after:absolute after:inset-0 after:bg-red-500 after:opacity-30 after:rounded-full' : ''}
          ${isCrit ? 'ring-4 ring-yellow-400 ring-opacity-75' : ''}
          ${isMotivated ? 'ring-4 ring-blue-400 ring-opacity-75' : ''}
        `}>
          <img 
            src={isBlack ? blackcat : whitecat} 
            alt={isBlack ? "Black Cat" : "White Cat"}
            className={`
              w-28 h-28 object-contain
              transition-all duration-150
              ${isAttacking ? 'scale-125' : ''}
            `}
          />
          {isGettingHit && (
            <div className="absolute -top-4 -right-4 text-2xl animate-bounce">
              {isCrit ? '⚡' : '💥'}
            </div>
          )}
        </div>
      </div>

      <div className="w-48">
        <HealthBar current={fighter.hp} max={fighter.maxHp} />
      </div>
      <div className="w-48">
        <EnergyBar current={fighter.energy} max={fighter.maxEnergy} />
      </div>
      <div className="text-sm text-gray-600 flex flex-col items-center">
        <div>HP: {fighter.hp}/{fighter.maxHp}</div>
        <div>Energy: {fighter.energy}/{fighter.maxEnergy}</div>
      </div>
    </div>
  );
}