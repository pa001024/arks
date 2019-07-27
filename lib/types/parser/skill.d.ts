import { Skill } from "../data/skill.i";
export interface SkillFlat {
    name: string;
    /** 触发方式 0=被动 1=主动 2=自动 */
    skillType: number;
    /** 回复方式 1=自动 2=攻击 4=受击 8=被动 */
    spType: number;
    rangeId?: string;
    levels: SkillLevel[];
}
interface SkillLevel {
    /** 持续时间 大于0 */
    duration?: number;
    /** SP需求 非0 */
    spCost?: number;
    /** 初始SP 非0 */
    initSp?: number;
    /** sp回复速度 只有不等于0或1时才会被记录 */
    increment?: number;
    /** 最大充能次数 非0 */
    description: string;
    rangeId?: string;
}
export declare const translateSkillIcon: (skill: Skill) => string[];
export declare const translateSkill: (skill: Skill) => SkillFlat;
export {};
//# sourceMappingURL=skill.d.ts.map