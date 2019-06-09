import * as fs from "fs-extra";
import { TMP_PREFIX, TARGET_PREFIX } from "./var";
// import { convertImageName } from "./parser/image";
import * as prettier from "prettier";
import chalk from "chalk";
import * as _ from "lodash";
import { exec } from "child-process-promise";
import * as path from "path";
import { Character, Profession, UnlockCondition } from "./parser/char.i";
import { HandBookTable, HandBook } from "./parser/handbook.i";
import { SkillTable } from "./parser/skill.i";
import { ItemTable, Item } from "./parser/item.i";
import { SkinTable } from "./parser/skin.i";
import { HandbookTeamTable } from "./parser/team.i";

// data cache
let skill_table: SkillTable;
let item_table: ItemTable;
let skin_table: SkinTable;
let handbook_team_table: HandbookTeamTable;
let collectedPic = new Set<string>();

const formatJSON = (src: any) => {
  return prettier.format(typeof src === "string" ? src : JSON.stringify(src), { parser: "json" });
};

const convertImage = async (fast: boolean = true) => {
  const basedir = TMP_PREFIX + "Texture2D/";
  const outdir = TARGET_PREFIX + "Texture2D/";
  await fs.ensureDir(outdir);
  const files = await fs.readdir(basedir);
  const hasPathid = /#\d\d+/;
  const alphas = files
    .filter(name => name.includes("[alpha]"))
    .map(name => {
      const head = name.substr(0, name.indexOf("[alpha]"));
      if (!collectedPic.has(head)) return;
      const tail = hasPathid.test(name);
      const re = new RegExp(`^${head.replace("+", "\\+")}(?: #\\d+)?\\.png$`);
      const origin = files.find(v => re.test(v) && hasPathid.test(v) === tail);
      if (!origin) console.log(chalk.red("missing"), name, re);
      // origin img, alpha, outfilename
      return [origin, name, head + (tail ? "_new" : "") + ".png"];
    })
    .filter(Boolean);

  for (let i = 0; i < alphas.length; i += 6) {
    const group = alphas.slice(i, i + 6);
    await Promise.all(
      group.map(async ([origin, alpha, out]) => {
        if (await fs.pathExists(outdir + out)) {
          // console.log(chalk.blue("file exists"), out);
          return;
        }
        await exec(
          ["magick convert", `"${path.resolve(basedir + origin)}"`, `"${path.resolve(basedir + alpha)}"`, "-alpha off -resize 1024x1024 -compose copyopacity -composite", `"${outdir}${out}"`].join(" ")
        );
        console.log(chalk.green("converted"), out);
      })
    );
  }
};

const toLuaObject = (obj: any, padding = 0) => {
  const pad = "    ".repeat(padding),
    padn1 = padding > 0 ? "    ".repeat(padding - 1) : "";
  if (typeof obj === "object" && obj !== null) {
    if (Array.isArray(obj)) {
      const hasObject = obj.some(v => typeof v === "object");
      if (hasObject && obj.length > 1) {
        const raw = obj.map(v => toLuaObject(v, padding + 1)).join(", ");
        return "{\n" + pad + raw + "\n" + padn1 + "}";
      } else {
        const raw = obj.map(v => toLuaObject(v, padding)).join(", ");
        return "{" + raw + "}";
      }
    } else {
      const content = _.map(obj, (v, k) => {
        if (v === null) return null;
        if (k.match(/^\w[\d\w]*$/)) return pad + `${k} = ${toLuaObject(v, padding + 1)},\n`;
        else return pad + `["${k}"] = ${toLuaObject(v)}\n`;
      }).filter(v => v !== null);
      return `{\n${content.join("")}${padn1}}`;
    }
  }
  return JSON.stringify(obj);
};

const convertObjectToLua = (arr: { name: string }[], name: string, dataname = (name.endsWith("s") ? name.substr(0, name.length - 1) : name) + "Data") => {
  const charList = arr.map(c => `["${c.name}"] = ${toLuaObject(c, 3)}`);
  const tmpl = `-- AUTOMATIC GENERATED, DO NOT EDIT
-- see https://github.com/pa001024/arks

local ${dataname} = {
    ["${name}"] = {
        ${charList.join(",\n        ")}
    },
}
return ${dataname}`;
  return tmpl;
};

interface SkillFlat {
  name: string;
  unlockCond: UnlockCondition;
}
interface TalentsFlat {
  name: string;
  unlockCond: UnlockCondition;
}

interface EvolveCost {
  name: string;
  count: number;
}

interface SkinFlat {
  id: string;
  name: string;
  desc: string;
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

interface CharacterFlat {
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
  skills: SkillFlat[];
  /** 天赋 */
  talents: TalentsFlat[];

  /** 精英化材料 */
  evolveCost: EvolveCost[][];

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
}

const isEmpty = (obj: object) => {
  if (Array.isArray(obj)) return obj.every(v => isEmpty(v));
  return !obj || Object.keys(obj).length;
};

const uniqArray = <T>(arr: T[]) => {
  const tmp = _.uniq(arr);
  if (tmp.length === 1) return tmp;
  return arr;
};

// 转换数据到需要的形式
const translateCharacter = (char: Character, handbook: HandBook) => {
  let dst = {} as CharacterFlat;
  // base
  [
    "id",
    "name",
    "rarity",
    "description",
    "canUseGeneralPotentialItem",
    "potentialItemId",
    // "team",
    "displayNumber",
    "appellation",
    "position",
    "tagList",
    "displayLogo",
    "itemUsage",
    "itemDesc",
    "itemObtainApproach",
    "maxPotentialLevel",
    "tokenKey",
  ].forEach(key => {
    dst[key] = char[key];
  });

  if (char.team > -1) {
    dst.team = {
      key: handbook_team_table[char.team + ""].teamKey,
      name: handbook_team_table[char.team + ""].teamName,
      color: handbook_team_table[char.team + ""].color,
    };
  }

  dst.profession = Profession[char.profession]; // 转换成中文

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
        dst.skills.push({
          // id: skill.skillId,
          name: skill.levels[0].name,
          unlockCond: v.unlockCond,
        });
      } else {
        console.log(chalk.red("[error]"), v.skillId, "skill not found");
      }
    });
    if (!dst.skills.length) delete dst.skills;
  }
  // 天赋
  if (char.talents) {
    dst.talents = [];
    char.talents.forEach(talent => {
      if (!talent.candidates) return;
      dst.talents.push({
        name: talent.candidates[0].name,
        unlockCond: talent.candidates[0].unlockCondition,
      });
    });
  }

  // handbook补充数据
  if (handbook) {
    dst.cv = handbook.infoName;
    dst.art = handbook.drawName;
  }

  // skin补充数据
  {
    const skins = _.filter(skin_table.charSkins, v => v.charId === char.id);
    if (skins && skins.length > 0) {
      dst.skins = skins.map(v => {
        const skin = {
          id: v.portraitId,
          name: v.displaySkin.skinGroupName,
          desc: v.displaySkin.content,
        } as SkinFlat;
        collectedPic.add(v.portraitId);
        if (v.displaySkin.drawerName && v.displaySkin.drawerName.toLowerCase() !== dst.art.toLowerCase()) skin.drawer = v.displaySkin.drawerName;
        return skin;
      });
    }
  }
  return dst;
};

interface ItemFlat {
  name: string;
  rarity: number;
  iconid: string;
}

const translateItem = (item: Item) => {
  return { name: item.name, rarity: item.rarity, iconid: item.iconId } as ItemFlat;
};

const convertItem = async () => {
  const itemList = _.map(item_table.items, translateItem);
  const luaOutput = convertObjectToLua(itemList, "Items");
  await fs.writeFile(TARGET_PREFIX + "ItemData.lua", luaOutput);
};

const convertCharacter = async () => {
  const character_table = JSON.parse(await fs.readFile(TMP_PREFIX + "ArknightsGameData/excel/character_table.json", "utf-8"));
  const handbook_info_table = JSON.parse(await fs.readFile(TMP_PREFIX + "ArknightsGameData/excel/handbook_info_table.json", "utf-8")) as HandBookTable;
  const charList = _.map(character_table, (v, id) => translateCharacter(Object.assign({ id }, v), handbook_info_table.handbookDict[id]));
  const luaOutput = convertObjectToLua(charList, "Characters");
  await fs.writeFile(TARGET_PREFIX + "CharacterData.lua", luaOutput);
  await fs.writeFile(TMP_PREFIX + "character_array.json", formatJSON(charList));
};

export default async (fast = true) => {
  // load data
  skill_table = JSON.parse(await fs.readFile(TMP_PREFIX + "ArknightsGameData/excel/skill_table.json", "utf-8"));
  item_table = JSON.parse(await fs.readFile(TMP_PREFIX + "ArknightsGameData/excel/item_table.json", "utf-8"));
  skin_table = JSON.parse(await fs.readFile(TMP_PREFIX + "ArknightsGameData/excel/skin_table.json", "utf-8"));
  handbook_team_table = JSON.parse(await fs.readFile(TMP_PREFIX + "ArknightsGameData/excel/handbook_team_table.json", "utf-8"));

  console.log("[build] STEP1: convertCharacter Start");
  await convertCharacter();
  console.log("[build] STEP2: convertItem Start");
  await convertItem();
  console.log("[build] STEP3: convertImage Start");
  await convertImage(fast);
  console.log("[build] All Finished");
};
