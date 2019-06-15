import { WikiBot } from "./wiki/bot";
import * as fs from "fs-extra";
import { TARGET_PREFIX } from "./var";
import chalk from "chalk";
import * as path from "path";

require("dotenv").config();

const uploadImage = async (dir: string, bot: WikiBot) => {
  const files = await fs.readdir(TARGET_PREFIX + dir + "/");
  for (let i = 0; i < files.length; i++) {
    const file = TARGET_PREFIX + dir + "/" + files[i];
    const name = path.basename(file);
    const url = await bot.getImageInfo(name);
    if (!url) {
      console.log("[sync]", chalk.green("uploading"), name);
      bot.uploadFile(file);
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
  // 自动上传图片
  if (mode === "image") {
    console.log("[sync] uploadImage start");
    await uploadImage("Texture2D", bot);
  }
  if (mode === "map") {
    console.log("[sync] uploadImage(map) start");
    await uploadImage("maps", bot);
  }
  // 同步模块数据
  if (mode === "module") {
    // const raw = await bot.raw("Module:Character/data");
    console.log("[sync] uploadModuleData start");
    await uploadModuleData(bot);
  }
  console.log("[sync] All Finished");
};
