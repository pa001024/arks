import { WikiBot } from "./wiki/bot";
require("dotenv").config();

const filelist = ``;

(async () => {
  const bot = new WikiBot("https://arknights.huijiwiki.com/", process.env.user, process.env.session);
  const list = filelist.split("\n");
  for (const page of list) {
    const rst = await bot.delete(page, "重复页面");
    if (rst) console.log("deleted", rst.title);
  }
})();
