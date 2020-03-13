import * as _ from "lodash";
import { charword_table, character_table } from "../data";

export interface CharwordFlat {
  id: string;
  name: string;
  cn_001: string;
  cn_002: string;
  cn_003: string;
  cn_004: string;
  cn_005: string;
  cn_006: string;
  cn_007: string;
  cn_008: string;
  cn_009: string;
  cn_010: string;
  cn_011: string;
  cn_012: string;
  cn_013: string;
  cn_014: string;
  cn_017: string;
  cn_018: string;
  cn_019: string;
  cn_020: string;
  cn_021: string;
  cn_022: string;
  cn_023: string;
  cn_024: string;
  cn_025: string;
  cn_026: string;
  cn_027: string;
  cn_028: string;
  cn_029: string;
  cn_030: string;
  cn_031: string;
  cn_032: string;
  cn_033: string;
  cn_034: string;
  cn_036: string;
  cn_037: string;
  cn_042: string;
}

export interface CharwordFlatTable {
  [key: string]: CharwordFlat;
}

export const translateCharword = () => {
  const initr = "cn_001/cn_002/cn_003/cn_004/cn_005/cn_006/cn_007/cn_008/cn_009/cn_010/cn_011/cn_012/cn_013/cn_014/cn_017/cn_018/cn_019/cn_020/cn_021/cn_022/cn_023/cn_024/cn_025/cn_026/cn_027/cn_028/cn_029/cn_030/cn_031/cn_032/cn_033/cn_034/cn_036/cn_037/cn_042".split(
    "/"
  );
  const charword = _.reduce(
    charword_table,
    (r, v) => {
      const char = character_table[v.charId];
      if (!r[char.name]) {
        r[char.name] = { id: v.charId.split("_")[2], name: char.name } as CharwordFlat;
        initr.forEach(v => (r[char.name][v] = "无"));
      }
      r[char.name][v.voiceId.toLowerCase()] = v.voiceText.replace(/\n/g, "<br>").trim();
      return r;
    },
    {} as CharwordFlatTable
  );
  return charword;
};
