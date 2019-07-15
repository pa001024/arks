import { WikiBot } from "./wiki/bot";
import * as fs from "fs-extra";
import { TARGET_PREFIX } from "./var";
import chalk from "chalk";
import * as path from "path";
import { formatJSON } from "./util";

require("dotenv").config();

const uploadImage = async (dir: string, bot: WikiBot, force = false) => {
  const files = await fs.readdir(TARGET_PREFIX + dir + "/");
  const TH = 4;
  for (let i = 0; i < files.length; i += TH) {
    const job = async (file: string) => {
      const name = path.basename(file);
      const url = await bot.getImageInfo(name);
      if (!url || force) {
        const rst = await bot.uploadFile(file);
        console.log("[sync]", name, rst.upload ? chalk.green("uploaded") + " " + rst.upload.result : chalk.red("error"));
      }
    };

    const jobfiles = files.slice(i, i + TH).map(v => TARGET_PREFIX + dir + "/" + v);
    try {
      await Promise.all(jobfiles.map(job));
    } catch (e) {
      console.log(chalk.red("[sync] upload failed => [auto retry]"), jobfiles);
      await Promise.all(jobfiles.map(job));
    }
  }
};

const syncPage = async (bot: WikiBot, title: string, text: string) => {
  if ((await bot.raw(title)) !== text) {
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
  await fs.writeFile(localFile, text);
};

const pullModules = async (bot: WikiBot) => {
  const pull = (module: string) => {
    return downloadPage(bot, `Module:${module}`, `src/module/${module}.lua`);
  };
  const list = "Enemy/Skill/Stage/Character/Item/Util/Charword".split("/");
  for (const mo of list) {
    console.log("pull", mo);
    await pull(mo);
  }
};
const pushModules = async (bot: WikiBot) => {
  const push = (module: string) => {
    return syncPageFromFile(bot, `Module:${module}`, `src/module/${module}.lua`, "");
  };
  const list = "Enemy/Skill/Stage/Character/Item/Util/Charword".split("/");
  for (const mo of list) {
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

export default async () => {
  const bot = new WikiBot("https://arknights.huijiwiki.com/", process.env.user, process.env.session);
  await bot.getToken();
  const mode = process.argv[3] || "module";
  const force = process.argv[4] === "-f";
  // 自动上传图片
  if (mode === "char") {
    console.log("[sync] uploadImage(char) start");
    await uploadImage("char", bot, force);
  }
  if (mode === "map") {
    console.log("[sync] uploadImage(map) start");
    await uploadImage("maps", bot, force);
  }
  if (mode === "cv") {
    await uploadImage("cv", bot, force);
  }
  if (mode === "skillimg") {
    console.log("[sync] uploadImage(skill) start");
    await uploadImage("skills", bot, force);
  }
  // 同步模块数据
  if (mode === "module") {
    // const raw = await bot.raw("Module:Character/data");
    console.log("[sync] uploadModuleData start");
    await uploadModuleData(bot);
  }
  // 同步
  if (mode === "book") {
    console.log("[sync] sync char.*sync.json start");
    await syncMultiPages(bot, "Char.sync.json");
    await syncMultiPages(bot, "CharSkill.sync.json");
    await syncMultiPages(bot, "CharHandbook.sync.json");
    await syncMultiPages(bot, "CharWord.sync.json");
  }
  if (mode === "enemy") {
    console.log("[sync] sync enemy.*sync.json start");
    await syncMultiPages(bot, "Enemy.sync.json");
  }
  if (mode === "stage") {
    console.log("[sync] sync stage.*sync.json start");
    await syncMultiPages(bot, "Stage.sync.json");
  }
  if (mode === "pull") {
    console.log("[sync] pull modules start");
    await pullModules(bot);
  }
  if (mode === "push") {
    console.log("[sync] push modules start");
    await pushModules(bot);
  }
  if (mode === "purge") {
    await purgeWithTemplate(bot, "template:NavboxEnemy");
    await purgeWithTemplate(bot, "template:NavboxChar");
    await purgeWithTemplate(bot, "template:NavboxStage");
  }
  if (mode === "tab") {
    await syncSinglePage(bot, "Data:Charword.tab", "CharWord.tab.json");
  }
  console.log("[sync] All Finished");
};
