import * as fs from "fs-extra";
import { exec } from "child-process-promise";
import { TMP_PREFIX, TARGET_PREFIX } from "../var";
import * as yaml from "yaml";
import { imgSizeOf } from "../util";

interface Meta {
  fileFormatVersion: number;
  guid: string;
  timeCreated: number;
  licenseType: string;
  TextureImporter: TextureImporter;
}

interface TextureImporter {
  fileIDToRecycleName: FileIDToRecycleName;
  externalObjects: ExternalObjects;
  serializedVersion: number;
  mipmaps: Mipmaps;
  bumpmap: Bumpmap;
  isReadable: number;
  grayScaleToAlpha: number;
  generateCubemap: number;
  cubemapConvolution: number;
  seamlessCubemap: number;
  textureFormat: number;
  maxTextureSize: number;
  textureSettings: TextureSettings;
  nPOTScale: number;
  lightmap: number;
  compressionQuality: number;
  spriteMode: number;
  spriteExtrude: number;
  spriteMeshType: number;
  alignment: number;
  spritePivot: SpritePivot;
  spriteBorder: SpriteBorder;
  spritePixelsToUnits: number;
  alphaUsage: number;
  alphaIsTransparency: number;
  spriteTessellationDetail: number;
  textureType: number;
  textureShape: number;
  maxTextureSizeSet: number;
  compressionQualitySet: number;
  textureFormatSet: number;
  platformSettings: PlatformSetting[];
  spriteSheet: SpriteSheet;
  spritePackingTag?: any;
  userData?: any;
  assetBundleName?: any;
  assetBundleVariant?: any;
}

interface SpriteSheet {
  serializedVersion: number;
  sprites: Sprite[];
  outline: any[];
  physicsShape: any[];
}

interface Sprite {
  serializedVersion: number;
  name: string;
  rect: Rect;
  alignment: number;
  pivot: SpritePivot;
  border: SpriteBorder;
  outline: SpritePivot[][];
  physicsShape: any[];
  tessellationDetail: number;
}

interface Rect {
  serializedVersion: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PlatformSetting {
  m_BuildTarget: string;
  m_MaxTextureSize: number;
  m_ResizeAlgorithm: number;
  m_TextureFormat: number;
  m_TextureCompression: number;
  m_CompressionQuality: number;
  m_CrunchedCompression: number;
  m_AllowsAlphaSplitting: number;
  m_Overridden: number;
  m_AndroidETC2FallbackOverride: number;
}

interface SpriteBorder {
  x: number;
  y: number;
  z: number;
  w: number;
}

interface SpritePivot {
  x: number;
  y: number;
}

interface TextureSettings {
  filterMode: number;
  aniso: number;
  mipBias: number;
  wrapMode: number;
}

interface Bumpmap {
  convertToNormalMap: number;
  externalNormalMap: number;
  heightScale: number;
  normalMapFilter: number;
}

interface Mipmaps {
  mipMapMode: number;
  enableMipMap: number;
  sRGBTexture: number;
  linearTexture: number;
  fadeOut: number;
  borderMipMap: number;
  mipMapsPreserveCoverage: number;
  alphaTestReferenceValue: number;
  mipMapFadeDistanceStart: number;
  mipMapFadeDistanceEnd: number;
}

interface ExternalObjects {}

interface FileIDToRecycleName {
  [key: string]: string;
}

export const convertItemImages = async () => {
  // 通道合并
  const basedir = TMP_PREFIX + "item_icons_hub.ab/Assets/Texture2D/";
  const files = await fs.readdir(basedir);
  const outs = [];
  for (const file of files.filter(v => v.endsWith(".png") && !v.includes("_alpha") && !v.includes("_out"))) {
    const origin = file,
      alpha = /_(\d+)\.png/.test(file) ? file.replace(/_(\d+)\.png/, "_alpha_$1.png") : file.replace(".png", "_alpha.png"),
      out = file.replace(".png", "_out.png");
    outs.push([out, file + ".meta"]);
    await exec(`magick convert "${basedir + origin}" "${basedir + alpha}" -alpha off -compose copyopacity -composite ${basedir}${out}`);
  }
  await fs.ensureDir(`${TARGET_PREFIX}items`);
  // 图片分割
  for (const [img, meta] of outs) {
    const data = yaml.parse(await fs.readFile(basedir + meta, "utf-8")) as Meta;
    for (const sprite of data.TextureImporter.spriteSheet.sprites) {
      const res = (await imgSizeOf(basedir + img)).width;
      const size = `${Math.round(sprite.rect.width)}x${Math.round(sprite.rect.height)}+${Math.round(sprite.rect.x)}+${Math.round(res - sprite.rect.y - sprite.rect.height)}`;
      console.log(size);
      await exec(`magick convert "${basedir + img}" -crop ${size} ${TARGET_PREFIX}items/${sprite.name}.png`);
    }
  }
};
