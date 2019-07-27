import { EnemyHandbook } from "../data/enemy.i";
export interface EnemyFlat {
    id: string;
    name: string;
    description: string;
    /** 序号 */
    index: string;
    /** 序号 */
    level: string;
    /** 评级endure,attack,defence,resistance */
    handbook: string[];
    enemyRace?: string;
    attackType: string;
    ability?: string;
    maxHp0: number;
    atk0: number;
    def0: number;
    magicResistance0: number;
    moveSpeed0: number;
    baseAttackTime0: number;
    massLevel0: number;
    rangeRadius0: number;
    maxHp1?: number;
    atk1?: number;
    def1?: number;
    magicResistance1?: number;
    moveSpeed1?: number;
    baseAttackTime1?: number;
    massLevel1?: number;
    rangeRadius1?: number;
    stunImmune?: boolean;
    silenceImmune?: boolean;
}
export declare const translateEnemy: (enemyHandbook: EnemyHandbook) => EnemyFlat;
//# sourceMappingURL=enemy.d.ts.map