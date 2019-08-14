import * as fs from "fs-extra";
import { exec } from "child-process-promise";
import { TMP_PREFIX, TARGET_PREFIX } from "../var";
import * as yaml from "yaml";
import { imgSizeOf } from "../util";
import { Meta } from "./unpack.meta";

export const unpackuTinyRipper = async (abfile: string,dir:string) => {
  // 通道合并
  const basedir = TMP_PREFIX + abfile + "/Assets/Texture2D/";
  const files = await fs.readdir(basedir);
  const outs = [];
  for (const file of files.filter(v => v.endsWith(".png") && !v.includes("_alpha") && !v.includes("_out"))) {
    const origin = file,
      alpha = /_(\d+)\.png/.test(file) ? file.replace(/_(\d+)\.png/, "_alpha_$1.png") : file.replace(".png", "_alpha.png"),
      out = file.replace(".png", "_out.png");
    outs.push([out, file + ".meta"]);
    await exec(`magick convert "${basedir + origin}" "${basedir + alpha}" -alpha off -compose copyopacity -composite ${basedir}${out}`);
  }
  await fs.ensureDir(`${TARGET_PREFIX}${dir}`);
  // 图片分割
  for (const [img, meta] of outs) {
    const data = yaml.parse(await fs.readFile(basedir + meta, "utf-8")) as Meta;
    for (const sprite of data.TextureImporter.spriteSheet.sprites) {
      const res = (await imgSizeOf(basedir + img)).height;
      const size = `${Math.round(sprite.rect.width)}x${Math.round(sprite.rect.height)}+${Math.round(sprite.rect.x)}+${Math.round(res - sprite.rect.y - sprite.rect.height)}`;
      console.log(sprite.name, size);
      await exec(`magick convert "${basedir + img}" -crop ${size} ${TARGET_PREFIX}${dir}/${sprite.name}.png`);
    }
  }
};
