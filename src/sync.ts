import { WikiBot } from "./wiki/bot";
import * as fs from "fs-extra";
import { TARGET_PREFIX } from "./var";
import chalk from "chalk";
import * as path from "path";

require("dotenv").config();

const uploadImage = async (dir: string, bot: WikiBot, force = false) => {
  const files = await fs.readdir(TARGET_PREFIX + dir + "/");
  const TH = 4;
  for (let i = 0; i < files.length; i += TH) {
    const job = async (file: string) => {
      const name = path.basename(file);
      const url = await bot.getImageInfo(name);
      if (!url || force) {
        await bot.uploadFile(file);
        console.log("[sync]", chalk.green("uploaded"), name);
        // const rst = await bot.uploadFile(file);
        // console.log(rst.upload);
      }
    };

    const jobfiles = files.slice(i, i + TH).map(v => TARGET_PREFIX + dir + "/" + v);
    try {
      await Promise.all(jobfiles.map(job));
    } catch {
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

const syncPageFromFile = async (bot: WikiBot, rawTitle: string, localFile: string) => {
  const file = TARGET_PREFIX + localFile;
  const localRaw = await fs.readFile(file, "utf-8");
  return await syncPage(bot, rawTitle, localRaw);
};

const uploadModuleData = async (bot: WikiBot) => {
  await syncPageFromFile(bot, "Module:Character/data", "CharacterData.lua");
  await syncPageFromFile(bot, "Module:Item/data", "ItemData.lua");
  await syncPageFromFile(bot, "Module:Stage/data", "StageData.lua");
  await syncPageFromFile(bot, "Module:Enemy/data", "EnemyData.lua");
  await syncPageFromFile(bot, "Module:Skill/data", "SkillData.lua");
};

interface Page {
  title: string;
  text: string;
}
const syncMultiPages = async (bot: WikiBot, file: string) => {
  const pages = JSON.parse(await fs.readFile(TARGET_PREFIX + file, "utf-8")) as Page[];
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    await syncPage(bot, page.title, page.text);
  }
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
  }
  console.log("[sync] All Finished");
};
