export interface Character {
  /** id */
  id: string;
  /** 中文名 */
  name: string;
  /** 描述 */
  description?: string;
  /** 是否可以用通用信物升级 */
  canUseGeneralPotentialItem: boolean;
  /** 信物id */
  potentialItemId: string;
  /** 队伍id */
  team: number;
  /** 显示序号 */
  displayNumber?: string;
  /** 召唤物id */
  tokenKey?: string;
  /** 别名 */
  appellation: string;
  /** 部署位置: 近战位 远程位 */
  position?: string;
  /** TAG: 输出 生存 削弱 群攻 控场 治疗 支援 防护 快速复活 位移 爆发 减速 费用回复 */
  tagList?: string[];
  /** 阵营标志 */
  displayLogo?: string;
  /** 登场介绍 */
  itemUsage?: string;
  /** 描述2 */
  itemDesc?: string;
  /** 获取途径: 主线剧情 招募寻访 预约奖励 活动获得 信用交易所 */
  itemObtainApproach?: string;
  /** 最大潜能 */
  maxPotentialLevel: number;
  /** 稀有度 0-5 */
  rarity: number;
  /** 职业: PIONEER WARRIOR TANK SPECIAL SNIPER CASTER MEDIC SUPPORT */
  profession: string;
  /** 基建技能 */
  trait?: Trait;
  /** 精英化阶段 */
  phases: Phase[];
  /** 技能 */
  skills: Skill[];
  /** 天赋 */
  talents?: Talent[];
  /** 潜能 */
  potentialRanks: PotentialRank[];
  /** 信赖值提升 */
  favorKeyFrames?: AttributesKeyFrame[];
  /** 技能升级 */
  allSkillLvlup: AllSkillLvlup[];
}

export enum Profession {
  PIONEER = "先锋",
  WARRIOR = "近卫",
  TANK = "重装",
  SPECIAL = "特种",
  SNIPER = "狙击",
  CASTER = "术士",
  MEDIC = "医疗",
  SUPPORT = "辅助",
  TOKEN = "召唤",
  TRAP = "陷阱",
}

export interface AllSkillLvlup {
  unlockCond: UnlockCondition;
  lvlUpCost?: EvolveCost[];
}

export interface Buff {
  attributes: Attributes;
}

export interface Attributes {
  abnormalFlags?: any;
  attributeModifiers: AttributeModifier[];
}

export interface AttributeModifier {
  attributeType: number;
  formulaItem: number;
  value: number;
  loadFromBlackboard: boolean;
  fetchBaseValueFromSourceEntity: boolean;
}

export interface PotentialRank {
  type: number;
  description: string;
  buff?: Buff;
  equivalentCost?: any;
}
export interface Talent {
  candidates?: CandidateFull[];
}

export interface CandidateFull {
  unlockCondition: UnlockCondition;
  requiredPotentialRank: number;
  prefabKey: string;
  name: string;
  description: string;
  rangeId?: string;
  blackboard: Blackboard[];
}

export interface LevelUpCostCond {
  unlockCond: UnlockCondition;
  lvlUpTime: number;
  levelUpCost?: EvolveCost[];
}

export interface Skill {
  skillId?: string;
  levelUpCostCond: LevelUpCostCond[];
  unlockCond: UnlockCondition;
}

export interface Phase {
  characterPrefabKey: string;
  rangeId?: string;
  maxLevel: number;
  attributesKeyFrames: AttributesKeyFrame[];
  evolveCost?: EvolveCost[];
}

export interface EvolveCost {
  id: string;
  count: number;
  type: string;
}

export interface AttributesKeyFrame {
  level: number;
  data: AttributeData;
}

export interface AttributeData {
  maxHp: number;
  atk: number;
  def: number;
  magicResistance: number;
  cost: number;
  blockCnt: number;
  moveSpeed: number;
  attackSpeed: number;
  baseAttackTime: number;
  respawnTime: number;
  hpRecoveryPerSec: number;
  spRecoveryPerSec: number;
  maxDeployCount: number;
  maxDeckStackCnt: number;
  tauntLevel: number;
  massLevel: number;
  baseForceLevel: number;
  stunImmune: boolean;
  silenceImmune: boolean;
}

export interface Trait {
  candidates: Candidate[];
}

export interface Candidate {
  unlockCondition: UnlockCondition;
  requiredPotentialRank: number;
  blackboard: Blackboard[];
}

export interface Blackboard {
  key: string;
  value: number;
}

export interface UnlockCondition {
  phase: number;
  level: number;
}
