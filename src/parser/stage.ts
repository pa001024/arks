import * as _ from "lodash";
import { stage_table, item_table, character_table, enemy_handbook_table, enemy_table } from "../data";
import { DisplayDetailReward, LevelData, EnemyDbRef } from "../data/stage.i";
import { purge } from "../util";
import { TMP_PREFIX, TARGET_PREFIX, DB_PREFIX } from "../var";
import { pathExistsSync, readFileSync } from "fs-extra";
import chalk from "chalk";
import { EnemyDetail, parseEnemyData } from "./enemy";

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
  // hardStagedId?: string;
  /** 可演习 */
  canPractice: boolean;
  /** 可代理 */
  canBattleReplay: boolean;
  /** 理智消耗 */
  apCost: number;
  /** 失败返还理智 */
  apFailReturn: number;
  /** 通关合成玉 恒为1 */
  // diamondOnceDrop: number;
  /** 演习消耗 不填为默认1*/
  practiceTicketCost?: number;
  /** 日常任务难度等级 -1 或 1~5 */
  // dailyStageDifficulty: number;
  /** 经验 */
  expGain: number;
  /** 龙门币 */
  goldGain: number;
  /** 2星信赖值获取? */
  // passFavor: number;
  /** 2星信赖 恒等于体力 */
  // completeFavor: number;
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
  enemies: EnemyDetail[];
}

const translateDrop = (drop: DisplayDetailReward) => {
  const item = item_table.items[drop.id];

  if (!item) {
    return; //drop.id;
  }
  return item.name;
};

const translateCharDrop = (drop: DisplayDetailReward) => {
  const char = character_table[drop.id];

  if (char) return char.name;
  return drop.id;
};



const mergeEnemyDbRef = (ref: EnemyDbRef) => {
  const enemy: EnemyDetail = {};
  if (ref.useDb) {
    const enemyDB = enemy_table[ref.id];
    if (!enemyDB) {
      console.log(chalk.red(`unknown enemyDBRef ${ref.id}`));
      return;
    }
    const base: any = Object.assign({}, parseEnemyData(enemyDB[0].enemyData), ref.level !== 0 && parseEnemyData(enemyDB[ref.level].enemyData));
    enemy.name = base.name;
  }
  Object.assign(enemy, parseEnemyData(ref.overwrittenData));
  return purge(enemy, v => !v);
};

const translateStageEnemy = (levelId: string, id: string) => {
  const file = DB_PREFIX + `levels/${levelId.toLowerCase()}.json`;
  if (pathExistsSync(file)) {
    const level = JSON.parse(readFileSync(file, "utf-8")) as LevelData;
    return level.enemyDbRefs
      .map(ref => {
        const mergedEnemy = mergeEnemyDbRef(ref);
        if (mergedEnemy) {
          return mergedEnemy;
        } else {
          console.log(`[translateStageEnemy]`, chalk.red(`enemy ${id} in ${levelId} not exsits`));
        }
      })
      .filter(Boolean);
  } else {
    console.log(`[translateStageEnemy]`, chalk.red(`level ${levelId} not exsits`));
  }
};

export const translateStagePreview = (stage: StageFlat) => {
  const raw = _.find(stage_table.stages, v => v.code === stage.name);
  if (raw) {
    const src = TMP_PREFIX + `DB/Texture2D/${raw.stageId}.png`;
    const dist = TARGET_PREFIX + `maps/${stage.preview}.png`;
    return [src, dist];
  }
  // 512*288
};

// 关卡数据
export const translateStage = () => {
  return _.filter(stage_table.stages, v => !v.stageId.includes("#f#") && !!v.name).map(main => {
    let dst = {} as StageFlat;
    // 突袭
    const hard = main.hardStagedId ? stage_table.stages[main.hardStagedId] : null;

    if (main.code === "剿灭作战") {
      dst.name = main.code = `${main.name}（剿灭作战）`;
      dst.preview = main.stageId;
    } else if (main.code) {
      dst.name = main.code.trim();
      dst.preview = "MAP-" + dst.name;
    }
    if (main.name) dst.alterName = main.name.trim();
    if (main.description) dst.description = main.description.replace(/\\n/g, "\n");
    if (hard && hard.description) dst.hardDesc = hard.description.replace("<@lv.fs>附加条件：</>\\n", "").replace(/\\n/g, "\n");
    if (main.dangerLevel && main.dangerLevel !== "-") dst.dangerLevel = main.dangerLevel;
    if (!main.canPractice) dst.canPractice = main.canPractice;
    if (!main.canBattleReplay) dst.canBattleReplay = main.canBattleReplay;
    if (main.apCost) dst.apCost = main.apCost;
    if (main.apFailReturn) dst.apFailReturn = main.apFailReturn;
    if (main.practiceTicketCost && main.practiceTicketCost !== 1 && main.practiceTicketCost !== -1) dst.practiceTicketCost = main.practiceTicketCost;
    if (main.expGain && main.expGain !== main.apCost * 10) dst.expGain = main.expGain;
    if (main.goldGain && main.goldGain !== main.apCost * 10) dst.goldGain = main.goldGain;
    // if (main.passFavor) dst.passFavor = main.passFavor;
    if (main.hilightMark) dst.hilightMark = main.hilightMark;
    if (main.bossMark) dst.bossMark = main.bossMark;
    if (main.isPredefined) dst.isPredefined = main.isPredefined;
    if (main.stageDropInfo && main.stageDropInfo.displayDetailRewards) {
      const drop = main.stageDropInfo.displayDetailRewards;
      const hardGrop = hard && hard.stageDropInfo && hard.stageDropInfo.displayDetailRewards;
      const processDrop = (v: DisplayDetailReward[]) => v && v.map(translateDrop).filter(Boolean);
      const firstDrop = processDrop(drop.filter(v => v.dropType === 1 && v.type !== "CHAR"));
      const firstCharDrop = drop
        .filter(v => v.dropType === 1 && v.type === "CHAR")
        .map(translateCharDrop)
        .filter(Boolean);
      const firstHardDrop = processDrop(hardGrop && hardGrop.filter(v => v.dropType === 1));
      const commonDrop = processDrop(drop.filter(v => v.dropType === 2));
      const specialDrop = processDrop(drop.filter(v => v.dropType === 3));
      const extraDrop = processDrop(drop.filter(v => v.dropType === 4));
      // const luckyDrop = drop.filter(v => v.dropType === 7);
      if (firstDrop && firstDrop.length) dst.firstDrop = firstDrop;
      if (firstCharDrop && firstCharDrop.length) dst.firstCharDrop = firstCharDrop;
      if (firstHardDrop && firstHardDrop.length) dst.firstHardDrop = firstHardDrop;
      if (commonDrop && commonDrop.length) dst.commonDrop = commonDrop;
      if (specialDrop && specialDrop.length) dst.specialDrop = specialDrop;
      if (extraDrop && extraDrop.length) dst.extraDrop = extraDrop;
    }
    if (main.levelId) {
      const enemies = translateStageEnemy(main.levelId, main.stageId);
      if (enemies && enemies.length) dst.enemies = enemies;
    } else {
      if (main.code !== "5-11") console.log(chalk.red(`${main.code} main.levelId not define`));
    }
    return purge(dst);
  });
};
