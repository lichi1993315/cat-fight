import React from 'react';
import { Sword, Swords, Flame, Footprints, Zap, Target, CircleDot, Sparkles } from 'lucide-react';
import type { Skill } from '../types';

interface SkillIconProps {
  skill: Skill;
  isOnCooldown: boolean;
  cooldownPercentage: number;
  isDisabled: boolean;
  align?: 'left' | 'right';
}

const iconMap: { [key: string]: React.ComponentType<any> } = {
  "爪击": CircleDot,
  "咬耳朵": Target,
  "尾鞭": Sword,
  "嘶吼": Zap,
  "利爪": Swords,
  "扑击": Footprints,
  "猫抓": Sparkles,
  "暗影爪": Flame,
};

export function SkillIcon({ skill, isOnCooldown, cooldownPercentage, isDisabled, align = 'left' }: SkillIconProps) {
  const Icon = iconMap[skill.name] || CircleDot;
  
  return (
    <div className="relative group">
      <div 
        className={`w-10 h-10 rounded-full flex items-center justify-center
          ${isDisabled ? 'bg-gray-200' : 'bg-indigo-100 hover:bg-indigo-200'} 
          transition-all duration-200 relative overflow-hidden`}
      >
        <Icon 
          size={20} 
          className={`${isDisabled ? 'text-gray-400' : 'text-indigo-600'}`}
        />
        {isOnCooldown && (
          <div 
            className="absolute inset-0 bg-gray-500 bg-opacity-50 transition-all duration-100"
            style={{
              clipPath: `circle(${100 - cooldownPercentage}% at 50% 50%)`
            }}
          />
        )}
      </div>
      
      <div className={`absolute top-1/2 -translate-y-1/2 w-48 py-2 px-3 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50
        ${align === 'left' ? 'left-12' : 'right-12'}`}>
        <div className="font-bold">{skill.name}</div>
        <div className="text-gray-300 text-xs">{skill.description}</div>
        <div className="text-gray-300 text-xs">
          伤害: {skill.damage} | 能量: {skill.energyCost}
        </div>
      </div>
    </div>
  );
}