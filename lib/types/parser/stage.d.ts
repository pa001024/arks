interface StageFlat {
    /** 关卡序号 0-1 */
    name: string;
    /** 名称 TR关卡没有 */
    alterName?: string;
    /** 描述 */
    description: string;
    /** 突袭附加条件 */
    hardDesc: string;
    /** 推荐等级 */
    dangerLevel: string;
    /** 预览 */
    preview: string;
    /** 突袭关 */
    /** 可演习 */
    canPractice: boolean;
    /** 可代理 */
    canBattleReplay: boolean;
    /** 理智消耗 */
    apCost: number;
    /** 失败返还理智 */
    apFailReturn: number;
    /** 通关合成玉 恒为1 */
    /** 演习消耗 不填为默认1*/
    practiceTicketCost?: number;
    /** 日常任务难度等级 -1 或 1~5 */
    /** 经验 */
    expGain: number;
    /** 龙门币 */
    goldGain: number;
    /** 2星信赖值获取? */
    /** 2星信赖 恒等于体力 */
    /** 是否高亮(暗红色底) */
    hilightMark?: boolean;
    /** 是否BOSS关 */
    bossMark?: boolean;
    /** 无法变更配置 */
    isPredefined?: boolean;
    /** 物品掉落 */
    firstDrop?: string[];
    firstCharDrop?: string[];
    firstHardDrop?: string[];
    commonDrop?: string[];
    specialDrop?: string[];
    extraDrop?: string[];
    /** 敌人 */
    enemies: string[];
}
export declare const translateStagePreview: (stage: StageFlat) => string[];
export declare const translateStage: () => StageFlat[];
export {};
//# sourceMappingURL=stage.d.ts.map