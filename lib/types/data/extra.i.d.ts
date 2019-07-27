export interface CharExtraTable {
    [key: string]: CharExtra;
}
interface CharExtra {
    name: string;
    appearance: string;
    baseSkill: BaseSkill[];
}
interface BaseSkill {
    name: string;
    cond: string;
    at: string;
    desc: string;
}
export {};
//# sourceMappingURL=extra.i.d.ts.map