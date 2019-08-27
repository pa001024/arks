import { WikiBot } from "./wiki/bot";
import * as fs from "fs-extra";
import { TARGET_PREFIX, TMP_PREFIX } from "./var";
import chalk from "chalk";
import * as path from "path";
import { formatJSON } from "./util";
import { toSkinFile } from "./parser/char";
import { loadData } from "./data";

require("dotenv").config();

const uploadImage = async (dir: string, bot: WikiBot, force = false, skip = "", renamer?: (src: string) => string) => {
  const files = await fs.readdir(TARGET_PREFIX + dir + "/");
  const TH = 3;
  let skipv = skip,
    skipedFiles = 0;
  if (force) console.log(chalk.red(`force mode enabled`));
  if (skipv) console.log(chalk.green(`start skip to ${skip}`));
  for (let i = 0; i < files.length; i += TH) {
    const job = async (file: string) => {
      const name = path.basename(file);
      if (skipv) {
        ++skipedFiles;
        if (skipv === name) {
          console.log(chalk.green(`skipped ${skipedFiles}/${files.length} files`));
          skipv = "";
        }
        return;
      }
      let done = false;
      do {
        try {
          const distName = renamer ? renamer(name) : name;
          if (distName) {
            if (force || !(await bot.getImageInfo(distName))) {
              const rst = await bot.uploadFile(file, distName);
              console.log("[sync]", distName, rst.upload ? chalk.green("uploaded") + " " + rst.upload.result : chalk.red("error"));
            }
          }
          done = true;
        } catch (e) {
          console.log(chalk.red("[sync] upload failed => [auto retry]"), `${name}`, e.message);
        }
      } while (!done);
    };

    const jobfiles = files.slice(i, i + TH).map(v => TARGET_PREFIX + dir + "/" + v);
    await Promise.all(jobfiles.map(job));
  }
};

const syncPage = async (bot: WikiBot, title: string, text: string) => {
  // 去除末尾空行
  if ((await bot.raw(title)) !== text.replace(/\n$/, "")) {
    console.log("[sync]", chalk.greenBright("diff detected:"), title);
    const rst = await bot.edit({ title, text });
    if (rst.error) {
      console.log(chalk.red("[syncPage]"), rst);
    }
  }
};

const syncPageFromFile = async (bot: WikiBot, rawTitle: string, localFile: string, base = TARGET_PREFIX) => {
  const file = base + localFile;
  const localRaw = await fs.readFile(file, "utf-8");
  return await syncPage(bot, rawTitle, localRaw);
};

const downloadPage = async (bot: WikiBot, rawTitle: string, localFile: string) => {
  const text = await bot.raw(rawTitle);
  if (text) await fs.writeFile(localFile, text);
};

const modulesList = "Enemy/Skill/Stage/Character/Item/Util/Charword".split("/");

const pullModules = async (bot: WikiBot) => {
  const pull = (module: string) => {
    return downloadPage(bot, `Module:${module}`, `src/module/${module}.lua`);
  };
  for (const mo of modulesList) {
    console.log("pull", mo);
    await pull(mo);
  }
};
const pushModules = async (bot: WikiBot) => {
  const push = (module: string) => {
    return syncPageFromFile(bot, `Module:${module}`, `src/module/${module}.lua`, "");
  };
  for (const mo of modulesList) {
    await push(mo);
  }
};

const uploadModuleData = async (bot: WikiBot) => {
  await Promise.all([
    syncPageFromFile(bot, "Module:Character/data", "CharacterData.lua"),
    syncPageFromFile(bot, "Module:Item/data", "ItemData.lua"),
    syncPageFromFile(bot, "Module:Stage/data", "StageData.lua"),
    syncPageFromFile(bot, "Module:Enemy/data", "EnemyData.lua"),
    syncPageFromFile(bot, "Module:Skill/data", "SkillData.lua"),
  ]);
};

const purgeWithTemplate = async (bot: WikiBot, tplName: string) => {
  const rst = await bot.purge({ generator: "transcludedin", titles: tplName, gtilimit: 500 });
  console.log(formatJSON(rst));
};

interface Page {
  title: string;
  text: string;
}
const syncMultiPages = async (bot: WikiBot, file: string, base = TARGET_PREFIX) => {
  const pages = JSON.parse(await fs.readFile(base + file, "utf-8")) as Page[];
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    await syncPage(bot, page.title, page.text);
  }
};

const syncSinglePage = async (bot: WikiBot, title: string, file: string) => {
  const text = await fs.readFile(TARGET_PREFIX + file, "utf-8");
  await syncPage(bot, title, text);
};

export default async (argv?: { [key: string]: any }) => {
  const bot = new WikiBot("https://arknights.huijiwiki.com/", process.env.user, process.env.session);
  await bot.getToken();
  const mode = argv.mode;
  const force = argv.force;
  // 模块管理
  if (mode === "pull") {
    console.log("[sync] pull modules start");
    await pullModules(bot);
  }
  if (mode === "push") {
    console.log("[sync] push modules start");
    await pushModules(bot);
  }
  // 自动上传图片
  if (mode === "char" || mode === "all") {
    console.log("[sync] uploadImage(char) start");
    await uploadImage("char", bot, force);
  }
  if (mode === "hr" /*  || mode === "all" */) {
    console.log("[sync] uploadHR start");
    await syncPageFromFile(bot, "Gadget:Hr.css", "HR/hr.css", TMP_PREFIX);
    await syncPageFromFile(bot, "Gadget:Hr.js", "HR/hr.js", TMP_PREFIX);
  }
  if (mode === "po" || mode === "all") {
    await loadData();
    console.log("[sync] uploadImage(portrait) start");
    await uploadImage("portrait", bot, force, "", name => {
      const head = name.split(".")[0];
      return toSkinFile(head) + "_p.png";
    });
  }
  if (mode === "avatar" || mode === "all") {
    await loadData();
    console.log("[sync] uploadImage(avatar) start");
    await uploadImage("avatar", bot, force, "", name => {
      const head = name.split(".")[0];
      return toSkinFile(head) + "_a.png";
    });
  }
  if (mode === "itemimg" || mode === "all") {
    console.log("[sync] uploadImage(item) start");
    await uploadImage("items", bot, force, argv.skip);
  }
  if (mode === "map" || mode === "all") {
    console.log("[sync] uploadImage(map) start");
    await uploadImage("maps", bot, force);
  }
  if (mode === "cv" || mode === "all") {
    await uploadImage("cv", bot, force);
  }
  if (mode === "skillimg" || mode === "all") {
    console.log("[sync] uploadImage(skill) start");
    await uploadImage("skills", bot, force);
  }
  // 同步模块数据
  if (mode === "module" || mode === "all") {
    // const raw = await bot.raw("Module:Character/data");
    console.log("[sync] uploadModuleData start");
    await uploadModuleData(bot);
  }
  // 同步
  if (mode === "book" || mode === "all") {
    console.log("[sync] sync char.*sync.json start");
    await syncMultiPages(bot, "Char.sync.json");
    await syncMultiPages(bot, "Skill.sync.json");
    await syncMultiPages(bot, "CharSkill.sync.json");
    await syncMultiPages(bot, "CharHandbook.sync.json");
    await syncMultiPages(bot, "CharWord.sync.json");
  }
  if (mode === "enemy" || mode === "all") {
    console.log("[sync] sync enemy.*sync.json start");
    await syncMultiPages(bot, "Enemy.sync.json");
  }
  if (mode === "stage" || mode === "all") {
    console.log("[sync] sync stage.*sync.json start");
    await syncMultiPages(bot, "Stage.sync.json");
  }
  if (mode === "tab" || mode === "all") {
    await syncSinglePage(bot, "Data:Charword.tab", "CharWord.tab.json");
  }
  if (mode === "purge" || mode === "all") {
    await purgeWithTemplate(bot, "template:NavboxEnemy");
    await purgeWithTemplate(bot, "template:NavboxChar");
    await purgeWithTemplate(bot, "template:NavboxStage");
    await purgeWithTemplate(bot, "template:技能条");
  }
  console.log("[sync] All Finished");
};
