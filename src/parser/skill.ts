import * as _ from "lodash";
import { Skill } from "../data/skill.i";

export interface SkillFlat {
  name: string;
  /** 触发方式 0=被动 1=主动 2=自动 */
  skillType: number;
  /** 回复方式 1=自动 2=攻击 4=受击 8=被动 */
  spType: number;
  rangeId?: string;
  levels: SkillLevel[];
  usedBy: string[];
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
  // maxChargeTime?: number;
  description: string;
  // 变化的范围
  rangeId?: string;
}

export const translateSkillIcon = (skill: Skill) => {
  return [skill.iconId || skill.skillId, skill.levels[0].name];
};

export const translateSkill = (skill: Skill) => {
  const dst = {} as SkillFlat;
  const base = skill.levels[0];
  dst.name = base.name;
  dst.skillType = base.skillType;
  dst.spType = base.spData.spType;
  if (base.rangeId) dst.rangeId = base.rangeId;
  dst.levels = skill.levels.map(lv => {
    const level = {} as SkillLevel;
    if (lv.duration && lv.duration > 0) level.duration = lv.duration;
    if (lv.rangeId !== base.rangeId) level.rangeId = lv.rangeId;
    if (lv.spData.spCost) level.spCost = lv.spData.spCost;
    if (lv.spData.initSp) level.initSp = lv.spData.initSp;
    if (lv.spData.increment != 0 && lv.spData.increment != 1) level.increment = lv.spData.increment;
    // if (lv.spData.maxChargeTime != 1 && lv.spData.maxChargeTime != 0) level.maxChargeTime = lv.spData.maxChargeTime;
    const props = lv.blackboard.reduce((r, v) => ((r[v.key] = v.value), r), {});
    level.description = lv.description
      .replace(/\{-?(.+?)(:.+?)?\}/g, (m, key: string, format: string) => {
        key = key.toLowerCase();
        const val = (m.startsWith("{-") ? -1 : 1) * props[key];
        if (format == ":0%") {
          return (val * 100).toFixed() + "%";
        }
        if (format == ":0.0%") {
          return (val * 100).toFixed(1) + "%";
        }
        return String(val);
      })
      .replace(/攻击间隔(?:<@ba\.vdown>增大<\/>|<@ba\.vup>.*?缩短<\/>)/g, m => {
        const val = props["base_attack_time"];
        return m + `(${val >= 0 ? "+" : ""}${val})`;
      })
      .replace(/攻击前摇/g, m => {
        const val = props["attack@stun"];
        return m + `(${val >= 0 ? "+" : ""}${val})`;
      });
    return level;
  });
  return dst;
};
