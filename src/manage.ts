import { WikiBot } from "./wiki/bot";
import chalk from "chalk";
require("dotenv").config();

const filelist = `文件:Adnachiel CN 013.ogg
文件:Adnachiel CN 017.ogg
文件:Adnachiel CN 012.ogg
文件:Adnachiel CN 018.ogg
文件:Adnachiel CN 008.ogg
文件:Adnachiel CN 010.ogg
文件:Adnachiel CN 009.ogg
文件:Adnachiel CN 011.ogg
文件:Adnachiel CN 004.ogg
文件:Adnachiel CN 007.ogg
文件:Adnachiel CN 005.ogg
文件:Adnachiel CN 003.ogg
文件:Adnachiel CN 001.ogg
文件:12F CN 036.ogg
文件:Adnachiel CN 002.ogg
文件:12F CN 042.ogg
文件:12F CN 027.ogg
文件:12F CN 029.ogg
文件:12F CN 028.ogg
文件:12F CN 030.ogg
文件:12F CN 031.ogg
文件:12F CN 034.ogg
文件:12F CN 032.ogg
文件:12F CN 033.ogg
文件:12F CN 026.ogg
文件:12F CN 025.ogg
文件:12F CN 024.ogg
文件:12F CN 023.ogg
文件:12F CN 021.ogg
文件:12F CN 020.ogg
文件:12F CN 012.ogg
文件:12F CN 018.ogg
文件:12F CN 017.ogg
文件:12F CN 011.ogg
文件:12F CN 008.ogg
文件:12F CN 010.ogg
文件:12F CN 009.ogg
文件:12F CN 007.ogg
文件:12F CN 002.ogg
文件:12F CN 001.ogg
文件:12F CN 004.ogg
文件:12F CN 003.ogg`;

(async () => {
  const bot = new WikiBot("https://arknights.huijiwiki.com/", process.env.user, process.env.session);
  await bot.getToken();
  const list = filelist.split("\n");
  for (const page of list) {
    const rst = await bot.delete(page, "重复页面");
    if (rst && rst.title) console.log("deleted", rst.title);
    else {
      console.log(chalk.red("[delete error]"), rst);
      break;
    }
  }
})();
