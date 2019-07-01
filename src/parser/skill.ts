import * as _ from "lodash";
import { Skill } from "src/data/skill.i";

export interface SkillFlat {
  name: string;
  /** 触发方式 0=被动 1=主动 2=自动 */
  skillType: number;
  /** 回复方式 1=自动 2=攻击 4=受击 8=被动 */
  spType: number;
  rangeId?: string;
  levels: SkillLevel[];
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
}

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
    if (lv.spData.spCost) level.spCost = lv.spData.spCost;
    if (lv.spData.initSp) level.initSp = lv.spData.initSp;
    if (lv.spData.increment != 0 && lv.spData.increment != 1) level.increment = lv.spData.increment;
    // if (lv.spData.maxChargeTime != 1 && lv.spData.maxChargeTime != 0) level.maxChargeTime = lv.spData.maxChargeTime;
    const props = lv.blackboard.reduce((r, v) => ((r[v.key] = v.value), r), {});
    level.description = lv.description.replace(/\{-?(.+?)(:.+?)?\}/g, (m, key, format) => {
      if (format == ":0%") {
        return (props[key] * 100).toFixed() + "%";
      }
      return props[key];
    });
    return level;
  });
  return dst;
};
