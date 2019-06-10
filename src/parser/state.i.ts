type Dict<T> = { [key: string]: T };

export interface StageTable {
  stages: Dict<Stage>;
  campaigns: Dict<Campaign>;
  mapThemes: Dict<MapTheme>;
  campaignGroups: Dict<CampaignGroup>;
}

export interface Stage {
  stageType: string;
  difficulty: string;
  unlockCondition: UnlockCondition[];
  stageId: string;
  levelId: string;
  zoneId: string;
  code: string;
  name?: string;
  description: string;
  hardStagedId?: string;
  dangerLevel: string;
  dangerPoint: number;
  loadingPicId: string;
  canPractice: boolean;
  canBattleReplay: boolean;
  apCost: number;
  apFailReturn: number;
  diamondOnceDrop: number;
  practiceTicketCost: number;
  dailyStageDifficulty: number;
  expGain: number;
  goldGain: number;
  loseExpGain: number;
  loseGoldGain: number;
  passFavor: number;
  completeFavor: number;
  slProgress: number;
  apProtectTimes: number;
  displayMainItem?: string;
  hilightMark: boolean;
  bossMark: boolean;
  isPredefined: boolean;
  appearanceStyle: number;
  stageDropInfo: StageDropInfo;
  mainStageId?: string;
}

export interface StageDropInfo {
  firstPassRewards?: any;
  passRewards?: any;
  completeRewards?: any;
  displayRewards?: DisplayReward[];
  displayDetailRewards?: DisplayDetailReward[];
}

export interface DisplayDetailReward {
  occPercent: number;
  type: string;
  id: string;
  dropType: number;
}

export interface DisplayReward {
  type: string;
  id: string;
  dropType: number;
}

export interface UnlockCondition {
  stageId: string;
  completeState: number;
}

export interface Campaign {
  stageId: string;
  gainLadders: GainLadder[];
  breakLadders: BreakLadder[];
  dropLadders: DropLadder[];
  displayRewards: DisplayReward[];
  displayDetailRewards: DisplayDetailReward[];
}

export interface DisplayReward {
  type: string;
  id: string;
  dropType: number;
}

export interface DropLadder {
  killCnt: number;
  dropInfo: DropInfo;
}

export interface DropInfo {
  firstPassRewards?: any;
  passRewards?: any;
  displayDetailRewards: DisplayDetailReward[];
}

export interface DisplayDetailReward {
  occPercent: number;
  type: string;
  id: string;
  dropType: number;
}

export interface BreakLadder {
  killCnt: number;
  breakFeeAdd: number;
  rewards: Reward[];
}

export interface Reward {
  id: string;
  count: number;
  type: string;
}

export interface GainLadder {
  killCnt: number;
  apFailReturn: number;
  favor: number;
  expGain: number;
  goldGain: number;
}

export interface MapTheme {
  themeId: string;
  unitColor: string;
}

export interface CampaignGroup {
  groupId: string;
  activeCamps: string[];
  startTs: number;
  endTs: number;
}
