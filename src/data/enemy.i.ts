export interface EnemyHandbookTable {
  [key: string]: EnemyHandbook;
}

export interface EnemyHandbook {
  enemyId: string;
  enemyIndex: string;
  sortId: number;
  name: string;
  enemyRace: string;
  enemyLevel: string;
  description: string;
  attackType: string;
  endure: string;
  attack: string;
  defence: string;
  resistance: string;
  ability: string;
}

export interface EnemyDatabase {
  enemies: Enemy[];
}

export interface EnemyTable {
  [key: string]: EnemyDataValue[];
}

export interface Enemy {
  Key: string;
  Value: EnemyDataValue[];
}

export interface EnemyDataValue {
  level: number;
  enemyData: EnemyData;
}

interface EnemyData {
  name: StringValue;
  description: StringValue;
  prefabKey: StringValue;
  attributes: Attributes;
  lifePointReduce: NumberValue;
  rangeRadius: NumberValue;
  talentBlackboard?: TalentBlackboard[];
  skills?: Skill[];
}

interface Skill {
  prefabKey: string;
  priority: number;
  cooldown: number;
  initCooldown: number;
  blackboard: TalentBlackboard[];
}

interface TalentBlackboard {
  key: string;
  value: number;
  valueStr?: any;
}

interface Attributes {
  maxHp: NumberValue;
  atk: NumberValue;
  def: NumberValue;
  magicResistance: NumberValue;
  cost: NumberValue;
  blockCnt: NumberValue;
  moveSpeed: NumberValue;
  attackSpeed: NumberValue;
  baseAttackTime: NumberValue;
  respawnTime: NumberValue;
  hpRecoveryPerSec: NumberValue;
  spRecoveryPerSec: NumberValue;
  maxDeployCount: NumberValue;
  massLevel: NumberValue;
  baseForceLevel: NumberValue;
  stunImmune: BoolValue;
  silenceImmune: BoolValue;
}

interface BoolValue {
  m_defined: boolean;
  m_value: boolean;
}

interface NumberValue {
  m_defined: boolean;
  m_value: number;
}

interface StringValue {
  m_defined: boolean;
  m_value?: string;
}
