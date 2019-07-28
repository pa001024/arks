import * as fs from "fs-extra";
import { exec } from "child-process-promise";
import { TMP_PREFIX } from "../var";

const convert = async () => {
  // 通道合并
  const basedir = TMP_PREFIX + "[pack]mainlinezoneitems.ab/Assets/Texture2D/";
  const files = await fs.readdir(basedir);
  const outs = [];
  for (const file of files.filter(v => v.endsWith(".png") && !v.includes("_alpha") && !v.includes("_out"))) {
    const origin = file,
      alpha = /_(\d+)\.png/.test(file) ? file.replace(/_(\d+)\.png/, "_alpha_$1.png") : file.replace(".png", "_alpha.png"),
      out = file.replace(".png", "_out.png");
    outs.push([out, file + ".meta"]);
    await exec(`magick convert "${basedir + origin}" "${basedir + alpha}" -alpha off -compose copyopacity -composite ${basedir}${out}`);
  }
};

convert();
