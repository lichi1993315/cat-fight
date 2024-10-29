import React from 'react';
import { SkillIcon } from './SkillIcon';
import type { Skill } from '../types';

interface SkillBarProps {
  skills: Skill[];
  cooldowns: { [key: string]: number };
  energy: number;
  align?: 'left' | 'right';
}

export function SkillBar({ skills, cooldowns, energy, align = 'left' }: SkillBarProps) {
  return (
    <div className={`absolute top-1/2 -translate-y-1/2 flex flex-col gap-2
      ${align === 'left' ? '-left-24' : '-right-24'}`}
    >
      {skills.map(skill => {
        const now = Date.now();
        const cooldownEnd = cooldowns[skill.name] || 0;
        const isOnCooldown = cooldownEnd > now;
        const cooldownPercentage = isOnCooldown 
          ? ((cooldownEnd - now) / skill.cooldown) * 100 
          : 0;
        const isDisabled = skill.energyCost > energy;

        return (
          <SkillIcon
            key={skill.name}
            skill={skill}
            isOnCooldown={isOnCooldown}
            cooldownPercentage={cooldownPercentage}
            isDisabled={isDisabled}
            align={align}
          />
        );
      })}
    </div>
  );
}