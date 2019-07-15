import * as _ from "lodash";
import { enemy_table } from "../data";
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

export const translateEnemy = (enemyHandbook: EnemyHandbook) => {
  const enemy = enemy_table[enemyHandbook.enemyId];
  const dst = {} as EnemyFlat;
  dst.id = enemyHandbook.enemyId;
  dst.name = enemyHandbook.name;
  dst.index = enemyHandbook.enemyIndex;
  dst.level = enemyHandbook.enemyLevel;
  dst.description = enemyHandbook.description;
  if (enemyHandbook.enemyRace) dst.enemyRace = enemyHandbook.enemyRace;
  dst.attackType = enemyHandbook.attackType;
  if (enemyHandbook.ability) dst.ability = enemyHandbook.ability;
  dst.handbook = [enemyHandbook.endure, enemyHandbook.attack, enemyHandbook.defence, enemyHandbook.resistance];
  if (enemy) {
    if (enemy.length < 1) {
      console.log(enemy);
      return;
    }
    const [level0, level1] = enemy;
    const attributes = ["maxHp", "atk", "def", "magicResistance", "moveSpeed", "baseAttackTime", "massLevel", "stunImmune", "silenceImmune"];
    attributes.forEach(v => {
      if (level0.enemyData.attributes[v].m_value) dst[v + "0"] = level0.enemyData.attributes[v].m_value;
    });
    if (level0.enemyData.rangeRadius.m_value) dst.rangeRadius0 = level0.enemyData.rangeRadius.m_value;
    if (level1) {
      attributes.forEach(v => {
        if (level1.enemyData.attributes[v].m_value) dst[v + "1"] = level1.enemyData.attributes[v].m_value;
      });
      if (level1.enemyData.rangeRadius.m_value) dst.rangeRadius1 = level1.enemyData.rangeRadius.m_value;
    }
  }
  return dst;
};
