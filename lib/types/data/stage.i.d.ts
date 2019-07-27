declare type Dict<T> = {
    [key: string]: T;
};
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
    /** 关卡序号 0-1 */
    code: string;
    /** 名称 TR关卡没有 */
    name?: string;
    /** 描述 突袭则为附加条件 */
    description: string;
    /** 突袭关 */
    hardStagedId?: string;
    /** 推荐等级 */
    dangerLevel: string;
    dangerPoint: number;
    loadingPicId: string;
    /** 可演习 */
    canPractice: boolean;
    /** 可代理 */
    canBattleReplay: boolean;
    /** 理智消耗 */
    apCost: number;
    /** 失败返还理智 */
    apFailReturn: number;
    /** 通关合成玉 恒为1 */
    diamondOnceDrop: number;
    /** 演习消耗 */
    practiceTicketCost: number;
    /** 日常任务难度等级 -1 或 1~5 */
    dailyStageDifficulty: number;
    /** 经验 */
    expGain: number;
    /** 龙门币 */
    goldGain: number;
    loseExpGain: number;
    loseGoldGain: number;
    /** 信赖值获取? */
    passFavor: number;
    completeFavor: number;
    slProgress: number;
    apProtectTimes: number;
    displayMainItem?: string;
    /** 是否高亮(暗红色底) */
    hilightMark: boolean;
    /** 是否BOSS关 */
    bossMark: boolean;
    /** 无法变更配置 */
    isPredefined: boolean;
    appearanceStyle: number;
    stageDropInfo: StageDropInfo;
    /** 突袭关对应的普通关 */
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
    /** 0=固定 3=小概率 4=罕见 */
    occPercent: number;
    type: string;
    id: string;
    /** 1=首次 2=常规 3=特殊 4=额外 7=幸运 */
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
export interface LevelData {
    options: Options;
    levelId?: any;
    mapId?: any;
    bgmEvent: string;
    mapData: MapData;
    tilesDisallowToLocate: any[];
    runes: Rune[];
    globalBuffs: any[];
    routes: (Route | null)[];
    enemies: any[];
    enemyDbRefs: EnemyDbRef[];
    waves: Wave[];
    predefines: Predefines;
    excludeCharIdList?: any;
    randomSeed: number;
}
interface Predefines {
    characterInsts: any[];
    tokenInsts: any[];
    characterCards: any[];
    tokenCards: any[];
}
interface Wave {
    preDelay: number;
    postDelay: number;
    maxTimeWaitingForNextWave: number;
    fragments: Fragment[];
    name?: any;
}
interface Fragment {
    preDelay: number;
    actions: Action[];
    name?: any;
}
interface Action {
    actionType: number;
    managedByScheduler: boolean;
    key: string;
    count: number;
    preDelay: number;
    interval: number;
    routeIndex: number;
    blockFragment: boolean;
    autoPreviewRoute: boolean;
    isUnharmfulAndAlwaysCountAsKilled: boolean;
}
interface EnemyDbRef {
    useDb: boolean;
    id: string;
    level: number;
    overwrittenData?: OverwrittenDatum;
}
interface OverwrittenDatum {
    name: Name;
    description: Name;
    prefabKey: Name;
    attributes: Attributes;
    lifePointReduce: MaxHp;
    rangeRadius: MaxHp;
    talentBlackboard?: any;
    skills?: any;
}
interface Attributes {
    maxHp: MaxHp;
    atk: MaxHp;
    def: MaxHp;
    magicResistance: MaxHp;
    cost: MaxHp;
    blockCnt: MaxHp;
    moveSpeed: MaxHp;
    attackSpeed: MaxHp;
    baseAttackTime: MaxHp;
    respawnTime: MaxHp;
    hpRecoveryPerSec: MaxHp;
    spRecoveryPerSec: MaxHp;
    maxDeployCount: MaxHp;
    massLevel: MaxHp;
    baseForceLevel: MaxHp;
    stunImmune: StunImmune;
    silenceImmune: StunImmune;
}
interface StunImmune {
    m_defined: boolean;
    m_value: boolean;
}
interface MaxHp {
    m_defined: boolean;
    m_value: number;
}
interface Name {
    m_defined: boolean;
    m_value?: any;
}
interface Route {
    motionMode: number;
    startPosition: StartPosition;
    endPosition: StartPosition;
    spawnRandomRange: SpawnRandomRange;
    spawnOffset: SpawnRandomRange;
    checkpoints: Checkpoint[];
    allowDiagonalMove: boolean;
    visitEveryTileCenter: boolean;
    visitEveryNodeCenter: boolean;
}
interface Checkpoint {
    type: number;
    time: number;
    position: StartPosition;
    reachOffset: SpawnRandomRange;
    randomizeReachOffset: boolean;
    reachDistance: number;
}
interface SpawnRandomRange {
    x: number;
    y: number;
}
interface StartPosition {
    row: number;
    col: number;
}
interface Rune {
    key: string;
    difficultyMask: number;
    professionMask: number;
    buildableMask: number;
    blackboard: Blackboard[];
}
interface Blackboard {
    key: string;
    value: number;
    valueStr?: any;
}
interface MapData {
    map: number[][];
    tiles: Tile[];
    blockEdges?: any;
    effects?: any;
    width: number;
    height: number;
}
interface Tile {
    tileKey: string;
    heightType: number;
    buildableType: number;
    passableMask: number;
    blackboard?: any;
    effects?: any;
}
interface Options {
    characterLimit: number;
    maxLifePoint: number;
    initialCost: number;
    maxCost: number;
    costIncreaseTime: number;
    moveMultiplier: number;
    steeringEnabled: boolean;
    isTrainingLevel: boolean;
    functionDisableMask: number;
}
export {};
//# sourceMappingURL=stage.i.d.ts.map