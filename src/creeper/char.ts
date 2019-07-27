import * as _ from "lodash";
import axios from "axios";
import * as fs from "fs-extra";
import { character_table, loadData } from "../data";
import chalk from "chalk";
import { TMP_PREFIX } from "../var";
import { formatJSON } from "../util";

// npx ts-node src/creeper/char.ts

// Material

interface CharMaterial {}
// 技能升级材料
interface SkillUpMaterial {}

const fetchPage = async (page: string) => {
  try {
    const rst = await axios.get(`http://wiki.joyme.com/arknights/${encodeURI(page)}?action=raw`);
    return rst.data;
  } catch {
    return "";
  }
};

const fetchJokes = async () => {
  const rex = /^\|(.+?)=([\s\S]*?(?=^\||^\}\}))/gm;
  const cnMap = {};
  const charNames = _.filter(character_table, v => !["TOKEN", "TRAP"].includes(v.profession)).map(v => v.name);
  for (let i = 0; i < charNames.length; i++) {
    const cn = charNames[i];
    const src = await fetchPage(cn);
    if (src) {
      rex.lastIndex = 0;
      let line: RegExpExecArray;
      let lines: RegExpExecArray[] = [];
      while ((line = rex.exec(src))) {
        lines.push(line);
      }
      cnMap[cn] = lines.reduce((r, v) => ((r[v[1]] = v[2].trim()), r), {});
      console.log(chalk.green("[creeper]"), cn, "boom");
    }
  }
  await fs.writeFile(TMP_PREFIX + "extraData.json", formatJSON(cnMap));
};

const convertCharPatch = async () => {
  const datas = JSON.parse(await fs.readFile(TMP_PREFIX + "extraData.json", "utf-8")) as any[];
  const rst = _.map(datas, data => {
    const transTable = {
      干员代号: "name",
      基建技能1: "baseSkill[0].name",
      基建技能1解锁: "baseSkill[0].cond",
      基建技能1设施: "baseSkill[0].at",
      基建技能1效果: "baseSkill[0].desc",
      基建技能1提升后: "baseSkill[0].evolve",
      基建技能1提升条件: "baseSkill[0].evolveCond",
      基建技能1提升后效果: "baseSkill[0].evolveDesc",
      基建技能2: "baseSkill[1].name",
      基建技能2解锁: "baseSkill[1].cond",
      基建技能2设施: "baseSkill[1].at",
      基建技能2效果: "baseSkill[1].desc",
    };
    const dst = {} as any;
    _.map(transTable, (p, k) => {
      if (data[k]) _.set(dst, p, data[k]);
    });
    return dst;
  }).reduce((r, v) => {
    r[v.name] = v;
    delete r[v.name].name;
    return r;
  }, {});
  await fs.writeFile("src/patch/char.json", formatJSON(rst));
};

const main = async () => {
  await loadData();
  await fetchJokes();
  await convertCharPatch();
};

main();
