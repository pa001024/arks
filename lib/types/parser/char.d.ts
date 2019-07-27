import { Character } from "../data/char.i";
import { HandBookInfo } from "../data/handbook.i";
interface CharSkillFlat {
    /** 技能中文名 */
    name: string;
    phase: number;
    level?: number;
    masterCost?: EvolveCost[][];
}
interface TalentsFlat {
    name: string;
    phase: number;
    level?: number;
    desc: string;
    upgrades?: SkillUpgradeFlat[];
}
interface SkillUpgradeFlat {
    name?: string;
    phase: number;
    level?: number;
    desc: string;
    potential: number;
}
interface EvolveCost {
    name: string;
    count: number;
}
interface SkinFlat {
    name: string;
    desc?: string;
    drawer?: string;
}
interface TeamFlat {
    key: string;
    name: string;
    color: string;
}
export interface CharacterFlat {
    /** id */
    id: string;
    /** 中文名 */
    name: string;
    /** 描述 */
    description?: string;
    /** 登场语音 */
    appearance?: string;
    /** 是否可以用通用信物升级 */
    canUseGeneralPotentialItem: boolean;
    /** 信物id */
    potentialItemId: string;
    /** 队伍id */
    team: TeamFlat;
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
    /** 职业: PIONEER WARRIOR TANK SPECIAL SNIPER CASTER MEDIC SUPPORTER */
    profession: string;
    /** 攻击范围 初始/精一/精二 */
    rangeId: string[];
    /** 最大等级 初始/精一/精二 */
    maxLevel: number[];
    /** 最大生命值 1/50/精一满/精二满 */
    maxHp: number[];
    /** 攻击 */
    atk: number[];
    /** 防御 */
    def: number[];
    /** 法抗 */
    magicResistance: number[];
    /** COST */
    cost: number[];
    /** 阻挡数 */
    blockCnt: number[];
    /** 移动速度??? */
    /** 攻速倍率 */
    attackSpeed: number[];
    /** 基础攻速 */
    baseAttackTime: number[];
    /** 重新部署时间 */
    respawnTime: number[];
    /** 回血速度 */
    hpRecoveryPerSec: number[];
    /** 回技速度 */
    spRecoveryPerSec: number[];
    /** 技能 */
    skills: CharSkillFlat[];
    /** 天赋 */
    talents: TalentsFlat[];
    /** 精英化材料 */
    evolveCost?: EvolveCost[][];
    /** 潜能提升效果 */
    potentialRanks?: string[];
    /** 嘲讽等级 1/0/-1 */
    tauntLevel?: number[];
    /** 重力等级 恒为0 */
    massLevel?: number[];
    /** 基础推力 恒为0 */
    baseForceLevel?: number[];
    /** 免疫眩晕 0/1 */
    stunImmune?: number[];
    /** 免疫沉默 0/1*/
    silenceImmune?: number[];
    /** CV */
    cv: string;
    /** 画师 */
    art: string;
    skins: SkinFlat[];
    skillCost: EvolveCost[][];
}
export declare const toSkinFile: (head: string) => string;
export declare const translateCharacter: (char: Character, handbook: HandBookInfo) => CharacterFlat;
export {};
//# sourceMappingURL=char.d.ts.map