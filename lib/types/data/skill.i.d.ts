export interface SkillTable {
    [key: string]: Skill;
}
export interface Skill {
    skillId: string;
    iconId?: string;
    hidden: boolean;
    levels: Level[];
}
export interface Level {
    name: string;
    rangeId?: string;
    description: string;
    skillType: number;
    spData: SpData;
    prefabId?: string;
    duration: number;
    blackboard: Blackboard[];
}
export interface Blackboard {
    key: string;
    value: number;
}
export interface SpData {
    spType: number;
    levelUpCost?: any;
    maxChargeTime: number;
    spCost: number;
    initSp: number;
    increment: number;
}
//# sourceMappingURL=skill.i.d.ts.map