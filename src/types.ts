export interface Fighter {
  name: string;
  hp: number;
  maxHp: number;
  damage: number;
  attackSpeed: number;
  critChance: number;
  critMultiplier: number;
  energy: number;
  maxEnergy: number;
  isBlack?: boolean;
  skills: Skill[];
  skillCooldowns: { [key: string]: number };
}

export interface Skill {
  name: string;
  description: string;
  damage: number;
  energyCost: number;
  cooldown: number;
}