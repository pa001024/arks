import * as fs from "fs-extra";
import { exec } from "child-process-promise";
import * as path from "path";
require("dotenv").config();

(async () => {
  console.log("updating ArknightsGameData...");
  await fs.ensureDir("tmp");
  // if (!(await fs.pathExists("tmp/ArknightsGameData"))) {
  //   await exec("git clone https://github.com/Perfare/ArknightsGameData.git tmp/ArknightsGameData");
  // }
  // await exec("cd tmp/ArknightsGameData && git reset origin/master --hard && git pull");
  console.log("converting ab files...");
  const files = ["arts/avatar_hub.ab", "arts/items/item_icons_hub.ab", "arts/skills/skill_icons_hub.ab", "arts/characters/chr_portraits_hub.ab"];
  await fs.ensureDir("tmp/ab");
  const base = process.env.base;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const name = file.split("/").reduceRight(a => a);
    console.log(`copying ${name}...`);
    await fs.copy(`${base}/${file}`, `tmp/ab/${name}`);
    const fpath = path.resolve("bin/ue.exe");
    const dpath = path.resolve(`tmp/ab/${name}`);
    await exec(`cd tmp && "${fpath}" "${dpath}"`);
  }
})();
