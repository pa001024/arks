import * as fs from "fs-extra";
import { TMP_PREFIX, TARGET_PREFIX } from "./var";
// import { convertImageName } from "./parser/image";
import * as prettier from "prettier";
import chalk from "chalk";
import * as _ from "lodash";
import { exec } from "child-process-promise";
import * as path from "path";
import { Character } from "./parser/char.i";

const formatJSON = (src: any) => {
  return prettier.format(typeof src === "string" ? src : JSON.stringify(src), { parser: "json" });
};

const convertImage = async () => {
  const basedir = TMP_PREFIX + "Texture2D/";
  const outdir = TARGET_PREFIX + "Texture2D/";
  await fs.ensureDir(outdir);
  const files = await fs.readdir(basedir);
  const hasPathid = /#\d\d+/;
  const alphas = files
    .filter(name => name.includes("[alpha]"))
    .map(name => {
      const head = name.substr(0, name.indexOf("[alpha]"));
      const tail = hasPathid.test(name);
      const re = new RegExp(`^${head}(?: #\\d+)?\\.png$`);
      const origin = files.find(v => re.test(v) && hasPathid.test(v) === tail);
      if (!origin) console.log(chalk.red("missing"), name, re);
      // origin img, alpha, outfilename
      return [origin, name, head + (tail ? "_new" : "") + ".png"];
    });

  for (let i = 0; i < alphas.length; i += 6) {
    const group = alphas.slice(i, i + 6);
    await Promise.all(
      group.map(async ([origin, alpha, out]) => {
        await exec(["magick convert", `"${path.resolve(basedir + origin)}"`, `"${path.resolve(basedir + alpha)}"`, "-alpha off -compose copyopacity -composite", `"${outdir}${out}"`].join(" "));
        console.log(chalk.green("converted"), out);
      })
    );
  }
};

const toLuaObject = (obj: any, padding = 0) => {
  const pad = "    ".repeat(padding);
  if (typeof obj === "object" && obj !== null) {
    if (Array.isArray(obj)) {
      const raw = obj.map(v => toLuaObject(v, padding)).join(", ");
      return "{" + raw + "}";
    } else {
      const content = _.map(obj, (v, k) => {
        if (v === null) return null;
        if (k.match(/^\w[\d\w]*$/)) return pad + `${k} = ${toLuaObject(v, padding + 1)},\n`;
        else return pad + `["${k}"] = ${toLuaObject(v)}\n`;
      }).filter(v => v !== null);
      return `{\n${content.join("")}${padding > 0 ? "    ".repeat(padding - 1) : ""}}`;
    }
  }
  return JSON.stringify(obj);
};

const convertCharacterToLua = (characters: Character[]) => {
  const charList = characters.map(c => `["${c.name}"] = ${toLuaObject(c, 3)}`);
  const tmpl = `-- AUTOMATIC GENERATED, DO NOT EDIT
-- see by https://github.com/pa001024/arks

local CharacterData = {
    ["IgnoreInCount"] = {},
    ["Characters"] = {
        ${charList.join(",\n        ")}
    },
}
return CharacterData`;
  return tmpl;
};

const convertCharacter = async () => {
  const charTable = JSON.parse(await fs.readFile(TMP_PREFIX + "character_table.json", "utf-8"));
  const charList = _.map(charTable, (v, id) => Object.assign({ id }, v)) as Character[];
  const luaOutput = convertCharacterToLua(charList);
  await fs.writeFile(TARGET_PREFIX + "CharacterData.lua", luaOutput);
  await fs.writeFile(TMP_PREFIX + "character_array.json", formatJSON(charList));
};

export default async (fast = true) => {
  // console.log("[build] STEP1: convertImage Start");
  // await convertImage();
  console.log("[build] STEP2: convertCharacter Start");
  await convertCharacter();
  console.log("[build] All Finished");
};
