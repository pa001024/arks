import * as _ from "lodash";
import { enemy_table } from "../data";
import { EnemyHandbook, EnemyData, EnemyTable } from "../data/enemy.i";
import { purge } from "../util";

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

  levels: EnemyAttribute[];
  refers: string[];
}
export interface EnemyAttribute {
  maxHp?: number;
  atk?: number;
  def?: number;
  magicResistance?: number;
  cost?: number;
  blockCnt?: number;
  moveSpeed?: number;
  attackSpeed?: number;
  baseAttackTime?: number;
  respawnTime?: number;
  hpRecoveryPerSec?: number;
  spRecoveryPerSec?: number;
  maxDeployCount?: number;
  massLevel?: number;
  baseForceLevel?: number;
  stunImmune?: boolean;
  silenceImmune?: boolean;
  lifePointReduce?: number;
  rangeRadius?: number;
}
export interface EnemyDetail extends EnemyAttribute {
  // id?: string;
  name?: string;
  description?: string;
}

export const parseEnemyData = (level: EnemyData, detail = true) => {
  return _.reduce(
    level,
    (r, v: any, n) => {
      if (n === "attributes") {
        _.forEach(v as EnemyTable[string][number]["enemyData"]["attributes"], (v, n) => {
          if (v.m_defined) r[n] = v.m_value;
        });
      } else if ((detail ? ["name", "description", "lifePointReduce", "rangeRadius"] : ["lifePointReduce", "rangeRadius"]).includes(n)) {
        if (v.m_defined) r[n] = v.m_value;
      }
      return r;
    },
    {}
  );
};

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
    dst.levels = enemy.map(v =>
      purge(parseEnemyData(v.enemyData, false), (v, n) => {
        if (n === "attackSpeed" && v === 100) return true;
        if (n === "massLevel" && v === 1) return true;
        if (n === "lifePointReduce" && v === 1) return true;
        return !v;
      })
    );
  }
  return dst;
};
