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

const syncModuleData = async (bot: WikiBot, rawTitle: string, localFile: string) => {
  const file = TARGET_PREFIX + localFile;
  const localRaw = await fs.readFile(file, "utf-8");
  if ((await bot.raw(rawTitle)) !== localRaw) {
    console.log("[sync]", chalk.greenBright("diff detected:"), rawTitle);
    await bot.edit({ title: rawTitle, text: localRaw });
  }
};

const uploadModuleData = async (bot: WikiBot) => {
  await syncModuleData(bot, "Module:Character/data", "CharacterData.lua");
  await syncModuleData(bot, "Module:Item/data", "ItemData.lua");
  await syncModuleData(bot, "Module:Stage/data", "StageData.lua");
  await syncModuleData(bot, "Module:Enemy/data", "EnemyData.lua");
};

export default async () => {
  const bot = new WikiBot("https://arknights.huijiwiki.com/", process.env.user, process.env.session);
  await bot.getToken();
  const mode = process.argv[3] || "module";
  const force = process.argv[4] === "force";
  // 自动上传图片
  if (mode === "char") {
    console.log("[sync] uploadImage(char) start");
    await uploadImage("char", bot, force);
  }
  if (mode === "map") {
    console.log("[sync] uploadImage(map) start");
    await uploadImage("maps", bot, force);
  }
  if (mode === "mappage ") {
    console.log("[sync] editmappage start");
  }
  // 同步模块数据
  if (mode === "module") {
    // const raw = await bot.raw("Module:Character/data");
    console.log("[sync] uploadModuleData start");
    await uploadModuleData(bot);
  }
  console.log("[sync] All Finished");
};
