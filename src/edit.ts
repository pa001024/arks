import { WikiBot } from "./wiki/bot";
import * as fs from "fs-extra";
import { TARGET_PREFIX, WIKI_PREFIX } from "./var";
import chalk from "chalk";
import { encodeFileName } from "./util";

require("dotenv").config();

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

export default async (argv?: { [key: string]: any }) => {
  const bot = new WikiBot("https://arknights.huijiwiki.com/", process.env.user, process.env.session);
  const file = argv.file;
  await bot.getToken();
  const ext = file.match(/^(?:模块:|module)/i) ? "lua" : "wiki";
  await syncPageFromFile(bot, file, `${encodeFileName(file)}.${ext}`, WIKI_PREFIX);

  console.log("[edit] Finished");
};
