import * as fs from "fs-extra";
import { exec } from "child-process-promise";
import * as path from "path";
import axios from "axios";
import { loadData, character_table } from "./data";
import { formatJSON } from "./util";
require("dotenv").config();

async function fetchChar(charid: string) {
  const rst = await axios.get(`https://andata.somedata.top/data-2020/char/data/${charid}.json`);
  return rst.data;
}

function delay(ms: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

(async () => {
  console.log("updating ArknightsGameData...");
  await fs.ensureDir("tmp");
  // if (!(await fs.pathExists("tmp/ArknightsGameData"))) {
  //   await exec("git clone https://github.com/Perfare/ArknightsGameData.git tmp/ArknightsGameData");
  // }
  // await exec("cd tmp/ArknightsGameData && git reset origin/master --hard && git pull");
  const base = process.env.base;
  if (base) {
    console.log("converting ab files...");
    const files = [
      "arts/avatar_hub.ab", //
      "arts/items/item_icons_hub.ab",
      "arts/skills/skill_icons_hub.ab",
      "arts/characters/chr_portraits_hub.ab",
      "arts/enemies/enemy_icons_hub.ab",
    ];
    await fs.ensureDir("tmp/ab");
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const name = file.split("/").reduceRight(a => a);
      console.log(`copying ${name}...`);
      await fs.copy(`${base}/${file}`, `tmp/ab/${name}`);
      const fpath = path.resolve("bin/ue.exe");
      const dpath = path.resolve(`tmp/ab/${name}`);
      await exec(`cd tmp && "${fpath}" "${dpath}"`);
    }
  }

  console.log("download online data...");
  await loadData();
  const dict = {};
  // update from network
  for (const key in character_table) {
    if (character_table.hasOwnProperty(key)) {
      const char = character_table[key];
      if (char.position !== "NONE") {
        console.log(`downloading ${key}`);
        let data: any;
        while (!data) {
          try {
            data = await fetchChar(key);
          } catch {
            data = null;
            console.log(`fetch ${key} failed, retrying`);
            await delay(1e3);
          }
        }
        dict[key] = data;
      }
    }
  }
  await fs.writeFile("tmp/onlineData.json", formatJSON(dict));
})();
