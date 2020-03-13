import { WikiBot } from "./wiki/bot";
import { WIKI_PREFIX } from "./var";
import * as fs from "fs-extra";
import { encodeFileName } from "./util";

export default async (argv?: { [key: string]: any }) => {
  const bot = new WikiBot("https://arknights.huijiwiki.com/", process.env.user, process.env.session);
  const file: string = argv.file;
  await bot.getToken();
  const raw = await bot.raw(file);
  const ext = file.match(/^(?:模块:|module)/i) ? "lua" : "wiki";
  await fs.writeFile(`${WIKI_PREFIX}${encodeFileName(file)}.${ext}`, raw);

  console.log("[raw] Finished");
};
