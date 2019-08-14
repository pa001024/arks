export interface MissionTable {
  missions: Missions;
  missionGroups: MissionGroups;
  periodicalRewards: PeriodicalRewards;
  weeklyRewards: WeeklyRewards;
}

interface WeeklyRewards {
  [key: string]: WeeklyReward;
}

interface WeeklyReward {
  groupId: string;
  id: string;
  periodicalPointCost: number;
  beginTime: number;
  endTime: number;
  type: string;
  sortIndex: number;
  rewards: Reward[];
}

interface PeriodicalRewards {
  [key: string]: DailyReward;
}

interface DailyReward {
  groupId: string;
  id: string;
  periodicalPointCost: number;
  type: string;
  sortIndex: number;
  period: number[];
  rewards: Reward[];
}

interface MissionGroups {
  [key: string]: MissionGroup;
}

interface MissionGroup {
  id: string;
  title: string;
  type: string;
  preMissionGroup: string;
  period?: any;
  rewards: Reward[];
  missionIds: string[];
  startTs: number;
  endTs: number;
}

interface Missions {
  [key: string]: MissionInfo;
}

interface MissionInfo {
  id: string;
  sortId: number;
  description: string;
  type: string;
  preMissionIds?: string[];
  template: string;
  templateType: string;
  param: string[];
  unlockCondition: string;
  unlockParam: string[];
  missionGroup: string;
  toPage?: any;
  periodicalPoint: number;
  rewards: Reward[];
  backImagePath: string;
}

interface Reward {
  type: string;
  id: string;
  count: number;
}
