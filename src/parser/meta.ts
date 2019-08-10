
export interface Meta {
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