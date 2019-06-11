import { WikiBot } from "./wiki/bot";
import * as fs from "fs-extra";
import { TARGET_PREFIX } from "./var";
import chalk from "chalk";
import * as path from "path";

require("dotenv").config();

export default async () => {
  const bot = new WikiBot("https://arknights.huijiwiki.com/", process.env.user, process.env.session);
  await bot.getToken();
  // 自动上传图片

  const files = await fs.readdir(TARGET_PREFIX + "Texture2D/");
  for (let i = 0; i < files.length; i++) {
    const file = TARGET_PREFIX + "Texture2D/" + files[i];
    const name = path.basename(file);
    const url = await bot.getImageInfo(name);
    if (!url) {
      console.log("[sync]", chalk.green("uploading"), name);
      bot.uploadFile(file);
    }
  }
  console.log("[sync] All Finished");
};
