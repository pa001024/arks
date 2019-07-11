import * as _ from "lodash";
import { Character, Profession } from "../data/char.i";
import { HandBookInfo } from "../data/handbook.i";
import { handbook_team_table, item_table, skill_table, skin_table, char_extra_table } from "../data";
import { isEmpty, firstCase } from "../util";
import chalk from "chalk";

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
  // id: string;
  name: string;
  desc?: string;
  // 仅与主设不同时才会存在
  drawer?: string;
}

interface TeamFlat {
  //"reservea1"
  key: string;
  //"行动预备组A1"
  name: string;
  //"58ccff"
  color: string;
}

export interface CharacterFlat {
  /** id */
  id: string;
  /** 中文名 */
  name: string;
  /** 描述 */
  description?: string;
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

  // 归并数据
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
  // moveSpeed: number[];
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

  // 暂时用不到的数据
  // /** 最大部署数量 */
  // maxDeployCount: number[];
  // /** ??? 恒为0 */
  // maxDeckStackCnt: number[];
  // /** 嘲讽等级 1/0/-1 */
  // tauntLevel: number[];
  // /** 重力等级 恒为0 */
  // massLevel: number[];
  // /** 基础推力 恒为0 */
  // baseForceLevel: number[];
  // /** 免疫眩晕 0/1 */
  // stunImmune: number[];
  // /** 免疫沉默 0/1*/
  // silenceImmune: number[];

  // handbook补充数据
  /** CV */
  cv: string;
  /** 画师 */
  art: string;

  // skin补充数据
  skins: SkinFlat[];

  // skill补充数据
  skillCost: EvolveCost[][];
}

const uniqArray = <T>(arr: T[]) => {
  const tmp = _.uniq(arr);
  if (tmp.length === 1) return tmp;
  return arr;
};

let collectedPic = new Set<string>();

export const toSkinFile = (head: string) => {
  const charName = head.match(/(char|token|trap)_(\d+)_([A-Za-z0-9]+)/);
  if (charName) {
    const skinTail = head.replace(`${charName[0]}_`, "").replace("#", "-");
    const skinHead = skinTail.split("-")[0];
    const skinHash = skinTail.split("-")[1];
    const skinid = skinTail.length === head.length ? head : charName[0] + (skinHash ? "@" + skinHead + "#" + skinHash : "#" + skinTail);
    const skin = skin_table.charSkins[skinid];
    if (skin) {
      const skinSeq = skinTail;
      const idMap = {
        "1+": 2,
        "2": 3,
      };
      const fileName = charName[3] + "-" + (idMap[skinSeq] || skinSeq);
      return firstCase(fileName);
    }
  }
  return;
};

// 转换数据到需要的形式
export const translateCharacter = (char: Character, handbook: HandBookInfo) => {
  let dst = {} as CharacterFlat;
  // base
  dst.id = char.id;
  dst.name = char.name;
  dst.rarity = char.rarity;
  if (char.description) dst.description = char.description.replace(/\\n/g, "\n");
  if (!char.canUseGeneralPotentialItem) dst.canUseGeneralPotentialItem = char.canUseGeneralPotentialItem;
  if (char.potentialItemId) dst.potentialItemId = char.potentialItemId;
  dst.displayNumber = char.displayNumber;
  dst.appellation = char.appellation;
  dst.position = char.position;
  dst.tagList = char.tagList;
  dst.displayLogo = char.displayLogo;
  dst.itemUsage = char.itemUsage;
  dst.itemDesc = char.itemDesc;
  dst.itemObtainApproach = char.itemObtainApproach;
  dst.maxPotentialLevel = char.maxPotentialLevel;
  dst.tokenKey = char.tokenKey;

  if (char.team > -1) {
    dst.team = {
      key: handbook_team_table[char.team + ""].teamKey,
      name: handbook_team_table[char.team + ""].teamName,
      color: handbook_team_table[char.team + ""].color,
    };
  }
  // 职业
  dst.profession = Profession[char.profession]; // 转换成中文
  // 潜能
  if (char.potentialRanks) dst.potentialRanks = char.potentialRanks.map(v => v.description);

  // 归并数据
  if (char.phases && char.phases[0] && char.phases[0].maxLevel) {
    dst.maxLevel = [];
    dst.rangeId = [];
    dst.evolveCost = [];

    const prop4list = ["maxHp", "atk", "def"];
    const prop3list = ["magicResistance", "cost", "blockCnt", "attackSpeed", "baseAttackTime", "respawnTime", "hpRecoveryPerSec", "spRecoveryPerSec"];

    char.phases.forEach((phase, index) => {
      // 初始数据
      if (index === 0) {
        prop4list.forEach(prop => {
          dst[prop] = [phase.attributesKeyFrames[0].data[prop]];
        });
        prop3list.forEach(prop => {
          dst[prop] = [];
        });
      }
      dst.maxLevel.push(phase.maxLevel);
      dst.rangeId.push(phase.rangeId);
      // 满级数据
      prop4list.concat(prop3list).forEach(prop => {
        dst[prop].push(phase.attributesKeyFrames[1].data[prop]);
      });
      if (phase.evolveCost) {
        dst.evolveCost.push(
          phase.evolveCost.map(v => {
            const item = item_table.items[v.id];
            return { name: item.name, count: v.count };
          })
        );
      }
    });
    dst.rangeId = uniqArray(dst.rangeId);
    // 将所有数值都一样的换成一个值
    prop3list.concat(prop4list).forEach(prop => {
      dst[prop] = uniqArray(dst[prop]);
    });
    if (isEmpty(dst.evolveCost)) delete dst.evolveCost;
  }

  // 技能
  if (char.skills) {
    dst.skills = [];
    char.skills.forEach(v => {
      if (!v.skillId) return;
      const skill = skill_table[v.skillId];
      if (skill) {
        const s = {
          // id: skill.skillId,
          name: skill.levels[0].name,
          phase: v.unlockCond.phase,
        } as CharSkillFlat;
        if (v.unlockCond.level != 1) s.level = v.unlockCond.level;
        // 专精材料
        const cost = v.levelUpCostCond.map(v => {
          // if (!v.levelUpCost) console.log(char.name);
          return (
            v.levelUpCost &&
            v.levelUpCost.map(v => {
              const item = item_table.items[v.id];
              return { name: item.name, count: v.count };
            })
          );
        });
        if (cost.length && cost[0] != null) s.masterCost = cost;
        dst.skills.push(s);
      } else {
        console.log(chalk.red("[error]"), v.skillId, "skill not found");
      }
    });
    if (!dst.skills.length) delete dst.skills;
  }
  // 技能升级
  if (char.allSkillLvlup && char.allSkillLvlup.length) {
    dst.skillCost = char.allSkillLvlup.map(rankup => {
      if (!rankup.lvlUpCost) {
        return [];
      }
      return rankup.lvlUpCost.map(cost => {
        const item = item_table.items[cost.id];
        return {
          name: item.name,
          count: cost.count,
        };
      });
    });
  }
  // 天赋
  if (char.talents) {
    dst.talents = [];
    char.talents.forEach(talent => {
      if (!talent.candidates) return;
      const s = {
        // id: skill.skillId,
        name: talent.candidates[0].name,
        phase: talent.candidates[0].unlockCondition.phase,
        level: talent.candidates[0].unlockCondition.level,
        desc: talent.candidates[0].description,
        upgrades: talent.candidates.slice(1).map(v => {
          const rst = {} as SkillUpgradeFlat;
          if (talent.candidates[0].name != v.name) rst.name = v.name;
          rst.phase = v.unlockCondition.phase;
          if (!v.unlockCondition.level && v.unlockCondition.level != 1) rst.level = v.unlockCondition.level;
          if (v.requiredPotentialRank) rst.potential = v.requiredPotentialRank;
          rst.desc = v.description;

          return rst;
        }),
      } as TalentsFlat;
      if (talent.candidates[0].unlockCondition.level != 1) s.level = talent.candidates[0].unlockCondition.level;
      dst.talents.push(s);
    });
  }

  // handbook补充数据
  if (handbook) {
    dst.cv = handbook.infoName;
    dst.art = handbook.drawName;
  }

  // skin补充数据
  const skins = _.filter(skin_table.charSkins, v => v.charId === char.id);
  if (skins && skins.length > 0) {
    dst.skins = skins.map(v => {
      const skin = {
        // id: v.portraitId,
        name: v.displaySkin.skinGroupName,
        // desc: v.displaySkin.content,
        file: toSkinFile(v.portraitId) + ".png",
      } as SkinFlat;
      collectedPic.add(v.portraitId);
      if (v.displaySkin.drawerName && v.displaySkin.drawerName.toLowerCase() !== dst.art.toLowerCase()) skin.drawer = v.displaySkin.drawerName;
      return skin;
    });
  }

  // extra补充数据
  const extra = char_extra_table[dst.name];
  if (extra) {
    Object.assign(dst, extra);
  }
  return dst;
};
