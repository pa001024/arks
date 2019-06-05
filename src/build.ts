import * as fs from "fs-extra";
import { TMP_PREFIX, TARGET_PREFIX } from "./var";
// import { convertImageName } from "./parser/image";
import * as prettier from "prettier";
import chalk from "chalk";
import * as _ from "lodash";
import { exec } from "child-process-promise";
import * as path from "path";

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

export default async (fast = true) => {
  console.log("[build] STEP1: convertImage Start");
  await convertImage();
  console.log("[build] All Finished");
};
