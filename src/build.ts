import * as fs from "fs-extra";
import { TMP_PREFIX, TARGET_PREFIX } from "./var";
// import { convertImageName } from "./parser/image";
import chalk from "chalk";
import * as _ from "lodash";
import { exec } from "child-process-promise";
import * as path from "path";
import { promisify } from "util";
import { loadData, item_table, character_table, handbook_info_table, enemy_handbook_table, skill_table } from "./data";
import { CharacterFlat, translateCharacter, toSkinFile } from "./parser/char";
import { translateItem } from "./parser/item";
import { convertObjectToLua, formatJSON } from "./util";
import { translateStage, translateStagePreview } from "./parser/stage";
import { translateEnemy } from "./parser/enemy";
import { translateSkill } from "./parser/skill";
const sizeOf: (file: string) => { width: number; height: number } = promisify(require("image-size"));

let charList: CharacterFlat[];

const convertCharImage = async () => {
  const basedir = TMP_PREFIX + "Texture2D/";
  const outdir = TARGET_PREFIX + "char/";
  await fs.ensureDir(outdir);
  const files = await fs.readdir(basedir);
  // const hasPathid = /#\d\d+/;
  let mainFiles: [string, string, string][] = [];
  for (let i = 0; i < files.length; i++) {
    const name = files[i];
    if (name.includes("[alpha]")) {
      const size = await sizeOf(basedir + name);
      if (size.width >= 1024 && size.height >= 1024) {
        const head = name.substr(0, name.indexOf("[alpha]"));
        let outName = toSkinFile(head);
        if (!outName) console.log(chalk.red("unknown skin"), head);
        const re = new RegExp(`^${head.replace("+", "\\+")}(?: #\\d+)?\\.png$`);
        const origin = await Promise.all(files.filter(v => re.test(v)).map(async name => ({ name, ...(await sizeOf(basedir + name)) })));
        const main = origin.find(v => v.height >= 1024);
        if (!main) {
          console.log(chalk.red("cant find file", name));
        } else {
          if (outName) mainFiles.push([main.name, name, outName + ".png"]);
        }
      }
    }
  }
  // 并行进程数
  const STEP = 2;
  for (let i = 0; i < mainFiles.length; i += STEP) {
    const group = mainFiles.slice(i, i + STEP);
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

const convertItem = async () => {
  const itemList = _.map(item_table.items, translateItem);
  const luaOutput = convertObjectToLua(itemList, "Items");
  await fs.writeFile(TARGET_PREFIX + "ItemData.lua", luaOutput);
};

const convertEnemy = async () => {
  const enemyList = _.map(enemy_handbook_table, translateEnemy);
  const luaOutput = convertObjectToLua(enemyList, "Enemies");
  await fs.writeFile(TARGET_PREFIX + "EnemyData.lua", luaOutput);
};

const convertCharacter = async () => {
  charList = _.map(character_table, (v, id) => translateCharacter(Object.assign({ id }, v), handbook_info_table.handbookDict[id]));

  await fs.writeFile(TARGET_PREFIX + "CharacterFlat.json", formatJSON(charList));
  const luaOutput = convertObjectToLua(charList, "Characters");
  await fs.writeFile(TARGET_PREFIX + "CharacterData.lua", luaOutput);
  await fs.writeFile(TMP_PREFIX + "character_array.json", formatJSON(charList));
};

const convertStage = async (cmd = "") => {
  const stages = translateStage();
  const stage_preview = _.map(stages, translateStagePreview);
  if (cmd === "map") {
    await fs.ensureDir(TARGET_PREFIX + "maps");
    for (let i = 0; i < stage_preview.length; i++) {
      const [src, dist] = stage_preview[i];
      if ((await fs.pathExists(src)) && !(await fs.pathExists(dist))) {
        console.log(chalk.green("[map] convert"), `${path.basename(src)} => ${path.basename(dist)}`);
        await exec(`magick convert "${path.resolve(src)}" -resize 512x288! "${dist}"`);
      }
    }
  }
  const luaOutput = convertObjectToLua(stages, "Stages");
  await fs.outputFile(TARGET_PREFIX + "StageData.lua", luaOutput);
};

const convertCharHandbook = async () => {
  const stories = _.map(handbook_info_table.handbookDict, char => {
    if (!character_table[char.charID]) {
      console.log(chalk.red("[Convert Char Handbook] charid not found"), char.charID);
      return;
    }
    const name = character_table[char.charID].name;
    const toWikiText = (s: string) => {
      return s.replace(/\n/g, "<br>").replace(/\. /g, ".&nbsp;");
    };
    return {
      title: `${name}/人员档案`,
      text: char.storyTextAudio
        .map(story => {
          const s = story.stories[0];
          return `{{情报
|storyTitle=${story.storyTitle}
|storyText=${toWikiText(s.storyText)}
|unLockType=${s.unLockType}
|unLockParam=${s.unLockParam}
|unLockString=${s.unLockString}
}}`;
        })
        .join("\n"),
    };
  }).filter(Boolean);
  await fs.writeFile(TARGET_PREFIX + "CharHandbook.json", formatJSON(stories));
};

const convertSkill = async () => {
  const skills = _.map(skill_table, translateSkill);
  const luaOutput = convertObjectToLua(skills, "Skills");
  await fs.writeFile(TARGET_PREFIX + "SkillData.lua", luaOutput);
  // await fs.writeFile(TARGET_PREFIX + "skill_array.json", formatJSON(skills));
};

export default async (cmd = "") => {
  fs.ensureDir(TARGET_PREFIX);
  await loadData();

  console.log("[build] STEP1: convertCharacter Start");
  await convertCharacter();
  console.log("[build] STEP2: convertItem Start");
  await convertItem();
  console.log("[build] STEP3: convertStage Start");
  await convertStage(cmd);
  console.log("[build] STEP4: convertEnemy Start");
  await convertEnemy();
  if (cmd === "char") {
    console.log("[build] STEP5: convertImage Start");
    await convertCharImage();
  }
  console.log("[build] STEP6: convertCharHandbook Start");
  await convertCharHandbook();
  console.log("[build] STEP7: convertSkill Start");
  await convertSkill();
  console.log("[build] All Finished");
};
