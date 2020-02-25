export interface CharExtraTable {
  [key: string]: CharExtra;
}
interface AttributesKeyFrameData {
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
  sleepImmune: boolean;
}

interface AttributesKeyFrame {
  level: number;
  data: AttributesKeyFrameData;
}

interface Phase {
  characterPrefabKey: string;
  rangeId: string;
  maxLevel: number;
  attributesKeyFrames: AttributesKeyFrame[];
  evolveCost?: any;
}

interface UnlockCondition {
  phase: number;
  level: number;
}

interface Blackboard {
  key: string;
  value: number;
}

interface Candidate {
  unlockCondition: UnlockCondition;
  requiredPotentialRank: number;
  prefabKey: string;
  name: string;
  description: string;
  rangeId?: any;
  blackboard: Blackboard[];
}

interface Talent {
  candidates: Candidate[];
}

interface PotentialRank {
  type: number;
  description: string;
  buff?: any;
  equivalentCost?: any;
}

interface AttributesKeyFrameData {
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
  sleepImmune: boolean;
}

interface FavorKeyFrame {
  level: number;
  data: AttributesKeyFrameData;
}

interface Cond {
  phase: number;
  level: number;
}

interface Data {
  buffId: string;
  buffName: string;
  buffIcon: string;
  skillIcon: string;
  sortId: number;
  buffColor: string;
  textColor: string;
  buffCategory: string;
  roomType: string;
  description: string;
}

export interface BuildingData {
  id: string;
  cond: Cond;
  data: Data;
}

interface CharExtra {
  name: string;
  description: string;
  canUseGeneralPotentialItem: boolean;
  potentialItemId: string;
  team: number;
  displayNumber: string;
  tokenKey?: any;
  appellation: string;
  position: string;
  tagList: string[];
  displayLogo: string;
  itemUsage: string;
  itemDesc: string;
  itemObtainApproach: string;
  maxPotentialLevel: number;
  rarity: number;
  profession: string;
  trait?: any;
  phases: Phase[];
  skills: any[];
  talents: Talent[];
  potentialRanks: PotentialRank[];
  favorKeyFrames: FavorKeyFrame[];
  allSkillLvlup: any[];
  buildingData: BuildingData[][];
}
