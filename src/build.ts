import * as fs from "fs-extra";
import { TMP_PREFIX, TARGET_PREFIX } from "./var";
import chalk from "chalk";
import * as _ from "lodash";
import async from "async";
import { exec } from "child-process-promise";
import * as path from "path";
import { loadData, item_table, character_table, handbook_info_table, enemy_handbook_table, skill_table, charword_table } from "./data";
import { CharacterFlat, translateCharacter, toSkinFile } from "./parser/char";
import { translateItem } from "./parser/item";
import { convertObjectToLua, formatJSON, json2Tab, imgSizeOf } from "./util";
import { translateStage, translateStagePreview } from "./parser/stage";
import { translateEnemy, EnemyFlat } from "./parser/enemy";
import { translateSkill, SkillFlat, translateSkillIcon } from "./parser/skill";
import { translateCharword } from "./parser/charword";
import { convertItemImages } from "./parser/item.img";

let charList: CharacterFlat[]; // 召唤物和干员
let vCharList: CharacterFlat[]; // 干员
let skillMap: { [key: string]: SkillFlat };

const convertCharImage = async () => {
  const basedir = TMP_PREFIX + "DB/Texture2D/";
  const outdir = TARGET_PREFIX + "char/";
  await fs.ensureDir(outdir);
  const files = await fs.readdir(basedir);
  // const hasPathid = /#\d\d+/;
  let mainFiles: [string, string, string][] = [];
  for (let i = 0; i < files.length; i++) {
    const name = files[i];
    if (name.includes("[alpha]")) {
      const size = await imgSizeOf(basedir + name);
      if (size.width >= 1024 && size.height >= 1024) {
        const head = name.substr(0, name.indexOf("[alpha]"));
        let outName = toSkinFile(head);
        if (!outName) console.log(chalk.red("unknown skin"), head);
        const re = new RegExp(`^${head.replace("+", "\\+")}(?: #\\d+)?\\.png$`);
        const origin = await Promise.all(files.filter(v => re.test(v)).map(async name => ({ name, ...(await imgSizeOf(basedir + name)) })));
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
  const enemyList = _.map(enemy_handbook_table, translateEnemy) as EnemyFlat[];
  const luaOutput = convertObjectToLua(enemyList, "Enemies");
  await fs.writeFile(TARGET_PREFIX + "EnemyData.lua", luaOutput);
  await fs.writeFile(
    TARGET_PREFIX + "Enemy.sync.json",
    formatJSON(
      enemyList.map(v => {
        return { title: v.name, text: "{{InfoboxEnemy}}{{NavboxEnemy}}" };
      })
    )
  );
};

const convertCharacter = async () => {
  charList = _.map(character_table, (v, id) => translateCharacter(Object.assign({ id }, v), handbook_info_table.handbookDict[id]));
  vCharList = charList.filter(v => v.displayNumber);

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
  await fs.outputFile(
    TARGET_PREFIX + "Stage.sync.json",
    formatJSON(
      stages.map(v => {
        return { title: v.name, text: `{{InfoboxStage}}{{NavboxStage}}` };
      })
    )
  );
};

const convertCharHandbook = async () => {
  const stories = _.map(handbook_info_table.handbookDict, char => {
    if (!character_table[char.charID]) {
      if (!char.charID.startsWith("npc")) console.log(chalk.red("[Convert Char Handbook] charid not found"), char.charID);
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

  const chars = _.map(handbook_info_table.handbookDict, char => {
    if (!character_table[char.charID]) return;
    const name = character_table[char.charID].name;
    return {
      title: `${name}`,
      text: `{{干员页面}}`,
    };
  }).filter(Boolean);
  await fs.writeFile(TARGET_PREFIX + "Char.sync.json", formatJSON(chars));
  await fs.writeFile(TARGET_PREFIX + "CharHandbook.sync.json", formatJSON(stories));
};

const convertSkill = async () => {
  const skills = _.map(skill_table, translateSkill);
  const luaOutput = convertObjectToLua(skills, "Skills");
  skillMap = skills.reduce((r, v) => ((r[v.name] = v), r), {});
  await fs.writeFile(TARGET_PREFIX + "SkillData.lua", luaOutput);
  await fs.writeFile(TARGET_PREFIX + "SkillFlat.json", formatJSON(skills));
};

// sync
const convertCharSkill = async () => {
  const sync = vCharList.map(v => {
    return { title: v.name + "/技能天赋", text: "{{#invoke:Character|renderSkillGroup}}" };
  });
  await fs.writeFile(TARGET_PREFIX + "CharSkill.sync.json", formatJSON(sync));
};
const convertCharWord = async () => {
  const charword = translateCharword();
  const tab = json2Tab(_.map(charword));

  const sync = vCharList.map(v => {
    return { title: v.name + "/语音互动", text: "{{#invoke:Charword|charword}}<noinclude>[[分类:语音]]</noinclude>" };
  });
  await fs.writeFile(TARGET_PREFIX + "CharWord.sync.json", formatJSON(sync));
  await fs.writeFile(TARGET_PREFIX + "CharWord.tab.json", JSON.stringify(tab));
};

const convertSkillIcon = async () => {
  const skillNames = _.map(skill_table, translateSkillIcon);
  await fs.ensureDir(TARGET_PREFIX + "skills");
  for (let i = 0; i < skillNames.length; i++) {
    const [id, name] = skillNames[i];
    if (id && name) {
      try {
        await fs.copy(TMP_PREFIX + "DB/Sprite/skill_icon_" + id + ".png", TARGET_PREFIX + "skills/" + name + ".png");
      } catch (e) {
        console.log(chalk.red(`[ERROR]`), `icon not found: ${id} ${name}`);
      }
    }
  }
};

// 语音转换
const convertCVAudio = async () => {
  await fs.ensureDir(TARGET_PREFIX + "cv");
  const files = _.map(charword_table, cw => {
    // const char = character_table[cw.charId];
    const id = cw.charId.split("_")[2];
    // if (id != "nightm") return null;
    return [
      TMP_PREFIX + "DB/AudioClip/assets/torappu/dynamicassets/audio/sound_beta_2/voice/" + cw.voiceAsset.toLowerCase() + ".wav", //
      TARGET_PREFIX + "cv/" + `${id}_${cw.voiceId}.ogg`,
    ];
  }).filter(Boolean);
  // let bats = [];
  await new Promise(resolve => {
    async.forEachLimit(
      files,
      8,
      async ([src, dst]) => {
        const cmd = `ffmpeg -i "${src}" -c libvorbis -n -v quiet -ab 128k "${dst}"`;
        if (await fs.pathExists(dst)) return;
        // console.log(chalk.blue("processing"), cmd);
        // bats.push(cmd);
        try {
          const rst = await exec(cmd);
          if (rst.stderr) {
            console.log(chalk.red("[error]"), rst.stderr);
            throw rst.stderr;
          } else {
            console.log(chalk.blue("processed"), cmd);
          }
        } catch (e) {
          if (e.stderr) console.log(chalk.red("[error]"), e.stderr);
        }
        return;
      },
      err => {
        resolve();
      }
    );
  });
  // await fs.writeFile(TARGET_PREFIX + "cmds.sh", bats.join("\n"));
};

export default async (cmd = "") => {
  fs.ensureDir(TARGET_PREFIX);
  await loadData();

  if (!cmd) {
    console.log("[build] STEP1: convertCharacter Start");
    await convertCharacter();
    console.log("[build] STEP2: convertItem Start");
    await convertItem();
    console.log("[build] STEP3: convertStage Start");
    await convertStage(cmd);
    console.log("[build] STEP4: convertEnemy Start");
    await convertEnemy();
    console.log("[build] STEP5: convertCharHandbook Start");
    await convertCharHandbook();
    console.log("[build] STEP6: convertSkill Start");
    await convertSkill();
    console.log("[build] STEP7.5: convertCharSkill Start");
    await convertCharSkill();
    console.log("[build] STEP7.6: convertCharWord Start");
    await convertCharWord();
  }
  if (cmd === "char") {
    console.log("[build] STEP4.5: convertImage Start");
    await convertCharImage();
  }
  if (cmd === "skill") {
    console.log("[build] STEP6.5: convertSkillIcon Start");
    await convertSkillIcon();
  }
  if (cmd === "cv") {
    console.log("[build] STEP7.7: convertCVAudio Start");
    await convertCVAudio();
  }
  if (cmd === "item") {
    console.log("[build] STEP1: convertItemImages Start");
    await convertItemImages();
  }
  console.log("[build] All Finished");
};
