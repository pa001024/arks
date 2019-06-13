export interface SkinTable {
  charSkins: { [key: string]: Skin };
  buildinEvolveMap: { [key: string]: BuildinEvolveMap };
}

export interface Skin {
  skinId: string;
  charId: string;
  tokenSkinId?: any;
  illustId: string;
  avatarId: string;
  portraitId: string;
  buildingId?: string;
  battleSkin: BattleSkin;
  isBuySkin: boolean;
  displaySkin: DisplaySkin;
}

export interface DisplaySkin {
  skinName?: string;
  colorList?: string[];
  titleList?: string[];
  modelName?: string;
  drawerName?: string;
  skinGroupId: string;
  skinGroupName: string;
  skinGroupSortIndex: number;
  content?: string;
  dialog?: string;
  usage?: string;
  description?: string;
  obtainApproach?: string;
}

export interface BattleSkin {
  overwritePrefab: boolean;
  skinOrPrefabId?: string;
}

export interface BuildinEvolveMap {
  "0": string;
  "1"?: string;
  "2"?: string;
}
