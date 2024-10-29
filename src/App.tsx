import React, { useState, useEffect } from 'react';
import { Fighter } from './components/Fighter';
import type { Fighter as FighterType, Skill } from './types';

const whiteSkills: Skill[] = [
  {
    name: "爪击",
    description: "快速的爪击",
    damage: 15,
    energyCost: 20,
    cooldown: 3000,
  },
  {
    name: "咬耳朵",
    description: "调皮地咬对手的耳朵",
    damage: 25,
    energyCost: 35,
    cooldown: 5000,
  },
  {
    name: "尾鞭",
    description: "用尾巴抽打对手",
    damage: 20,
    energyCost: 30,
    cooldown: 4000,
  },
  {
    name: "嘶吼",
    description: "发出震慑对手的嘶吼",
    damage: 40,
    energyCost: 50,
    cooldown: 8000,
  },
];

const blackSkills: Skill[] = [
  {
    name: "利爪",
    description: "锋利的爪击",
    damage: 18,
    energyCost: 25,
    cooldown: 3500,
  },
  {
    name: "扑击",
    description: "突然扑向对手",
    damage: 28,
    energyCost: 40,
    cooldown: 5500,
  },
  {
    name: "猫抓",
    description: "快速的连续抓击",
    damage: 22,
    energyCost: 35,
    cooldown: 4500,
  },
  {
    name: "暗影爪",
    description: "蓄力的致命一击",
    damage: 45,
    energyCost: 60,
    cooldown: 9000,
  },
];

function App() {
  const [whiteCat, setWhiteCat] = useState<FighterType>({
    name: "小吉",
    hp: 200,
    maxHp: 200,
    damage: 10,
    attackSpeed: 1000,
    critChance: 25,
    critMultiplier: 2,
    energy: 0,
    maxEnergy: 100,
    skills: whiteSkills,
    skillCooldowns: {},
  });

  const [blackCat, setBlackCat] = useState<FighterType>({
    name: "小黑",
    hp: 200,
    maxHp: 200,
    damage: 12,
    attackSpeed: 1200,
    critChance: 20,
    critMultiplier: 2.5,
    energy: 0,
    maxEnergy: 100,
    isBlack: true,
    skills: blackSkills,
    skillCooldowns: {},
  });

  const [winner, setWinner] = useState<string | null>(null);
  const [battleStarted, setBattleStarted] = useState(false);
  const [whiteAttacking, setWhiteAttacking] = useState(false);
  const [blackAttacking, setBlackAttacking] = useState(false);
  const [whiteCrit, setWhiteCrit] = useState(false);
  const [blackCrit, setBlackCrit] = useState(false);
  const [isMotivated, setIsMotivated] = useState(false);
  const [cheerCooldown, setCheerCooldown] = useState(false);
  const [whiteActiveSkill, setWhiteActiveSkill] = useState<string | null>(null);
  const [blackActiveSkill, setBlackActiveSkill] = useState<string | null>(null);

  const gainEnergy = (
    setFighter: React.Dispatch<React.SetStateAction<FighterType>>,
    amount: number
  ) => {
    setFighter(prev => ({
      ...prev,
      energy: Math.min(prev.maxEnergy, prev.energy + amount)
    }));
  };

  const normalAttack = (
    attacker: FighterType,
    defender: FighterType,
    setDefender: React.Dispatch<React.SetStateAction<FighterType>>,
    setAttacking: React.Dispatch<React.SetStateAction<boolean>>,
    setCrit: React.Dispatch<React.SetStateAction<boolean>>,
    setActiveSkill: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    setAttacking(true);
    setTimeout(() => setAttacking(false), 150);

    const isCritical = Math.random() * 100 < attacker.critChance;
    setCrit(isCritical);
    setTimeout(() => setCrit(false), 500);
    
    const damage = Math.round(
      attacker.damage * (isCritical ? attacker.critMultiplier : 1)
    );

    setActiveSkill("普通攻击");
    setTimeout(() => setActiveSkill(null), 1000);
    
    setDefender(prev => {
      const newHp = Math.max(0, prev.hp - damage);
      if (newHp === 0) {
        setWinner(attacker.name);
      }
      return { ...prev, hp: newHp };
    });
  };

  const useSkill = (
    attacker: FighterType,
    defender: FighterType,
    setAttacker: React.Dispatch<React.SetStateAction<FighterType>>,
    setDefender: React.Dispatch<React.SetStateAction<FighterType>>,
    setAttacking: React.Dispatch<React.SetStateAction<boolean>>,
    setCrit: React.Dispatch<React.SetStateAction<boolean>>,
    setActiveSkill: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    if (defender.hp <= 0 || winner) return;

    // Gain energy over time
    gainEnergy(setAttacker, 10);

    // Filter available skills (enough energy and not on cooldown)
    const availableSkills = attacker.skills.filter(skill => {
      const cooldownEnd = attacker.skillCooldowns[skill.name] || 0;
      return attacker.energy >= skill.energyCost && Date.now() > cooldownEnd;
    });

    // If no skills are available, use normal attack
    if (availableSkills.length === 0) {
      normalAttack(attacker, defender, setDefender, setAttacking, setCrit, setActiveSkill);
      return;
    }

    // Randomly select a skill
    const skill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
    
    setAttacking(true);
    setTimeout(() => setAttacking(false), 150);

    const isCritical = Math.random() * 100 < attacker.critChance;
    setCrit(isCritical);
    setTimeout(() => setCrit(false), 500);
    
    const damage = Math.round(
      skill.damage * (isCritical ? attacker.critMultiplier : 1)
    );

    setActiveSkill(skill.name);
    setTimeout(() => setActiveSkill(null), 1000);
    
    setAttacker(prev => ({
      ...prev,
      energy: prev.energy - skill.energyCost,
      skillCooldowns: {
        ...prev.skillCooldowns,
        [skill.name]: Date.now() + skill.cooldown
      }
    }));
    
    setDefender(prev => {
      const newHp = Math.max(0, prev.hp - damage);
      const newEnergy = Math.min(prev.maxEnergy, prev.energy + 15);
      
      if (newHp === 0) {
        setWinner(attacker.name);
      }
      return { ...prev, hp: newHp, energy: newEnergy };
    });
  };

  useEffect(() => {
    if (!battleStarted || winner) return;

    const whiteInterval = setInterval(() => {
      useSkill(
        whiteCat, 
        blackCat, 
        setWhiteCat, 
        setBlackCat, 
        setWhiteAttacking, 
        setWhiteCrit,
        setWhiteActiveSkill
      );
    }, whiteCat.attackSpeed * (isMotivated ? 0.5 : 1));

    const blackInterval = setInterval(() => {
      useSkill(
        blackCat, 
        whiteCat, 
        setBlackCat, 
        setWhiteCat, 
        setBlackAttacking, 
        setBlackCrit,
        setBlackActiveSkill
      );
    }, blackCat.attackSpeed);

    return () => {
      clearInterval(whiteInterval);
      clearInterval(blackInterval);
    };
  }, [battleStarted, winner, isMotivated]);

  const handleCheer = () => {
    if (whiteCat.energy < 50) {
      return;
    }
    
    setWhiteCat(prev => ({
      ...prev,
      energy: prev.energy - 50
    }));
    
    setIsMotivated(true);
    setCheerCooldown(true);
    
    setTimeout(() => {
      setIsMotivated(false);
    }, 2000);
    
    setTimeout(() => {
      setCheerCooldown(false);
    }, 5000);
  };

  const resetBattle = () => {
    setWhiteCat(prev => ({ 
      ...prev, 
      hp: prev.maxHp, 
      energy: 0,
      skillCooldowns: {} 
    }));
    setBlackCat(prev => ({ 
      ...prev, 
      hp: prev.maxHp, 
      energy: 0,
      skillCooldowns: {} 
    }));
    setWinner(null);
    setBattleStarted(false);
    setWhiteCrit(false);
    setBlackCrit(false);
    setIsMotivated(false);
    setCheerCooldown(false);
    setWhiteActiveSkill(null);
    setBlackActiveSkill(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-12">猫咪对战</h1>
      
      <div className="flex items-center gap-20 mb-12">
        <Fighter 
          fighter={whiteCat} 
          isAttacking={whiteAttacking}
          isGettingHit={blackAttacking}
          isCrit={whiteCrit}
          isMotivated={isMotivated}
          activeSkill={whiteActiveSkill}
        />
        <div className="text-2xl font-bold text-gray-600">VS</div>
        <Fighter 
          fighter={blackCat} 
          isBlack 
          isAttacking={blackAttacking}
          isGettingHit={whiteAttacking}
          isCrit={blackCrit}
          activeSkill={blackActiveSkill}
        />
      </div>

      {winner && (
        <div className="text-2xl font-bold text-green-600 mb-6 animate-bounce">
          {winner} 赢得了胜利! 🏆
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={winner ? resetBattle : () => setBattleStarted(true)}
          className={`px-6 py-3 rounded-lg font-bold text-white transition-all
            ${!battleStarted || winner 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-gray-400 cursor-not-allowed'}`}
          disabled={battleStarted && !winner}
        >
          {winner ? '重新开始' : battleStarted ? '战斗进行中...' : '开始战斗'}
        </button>

        {battleStarted && !winner && (
          <button
            onClick={handleCheer}
            disabled={cheerCooldown || whiteCat.energy < 50}
            className={`px-6 py-3 rounded-lg font-bold text-white transition-all
              ${cheerCooldown || whiteCat.energy < 50
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {cheerCooldown ? '加油中... 🎉' : whiteCat.energy < 50 ? '需要50能量! 💤' : '加油! 📣'}
          </button>
        )}
      </div>

      {battleStarted && !winner && (
        <div className="mt-6 text-gray-600 animate-pulse">
          战斗进行中...
          {isMotivated && (
            <span className="ml-2 text-blue-500 font-bold">
              小吉获得了鼓舞! ⚡
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default App;