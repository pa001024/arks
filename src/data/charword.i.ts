export interface CharwordTable {
  [key: string]: Charword;
}

export interface Charword {
  charWordId: string;
  charId: string;
  voiceId: string;
  voiceText: string;
  voiceTitle: string;
  voiceIndex: number;
  voiceType: string;
  unlockType: string;
  unlockParam: any[];
  lockDescription: string;
  placeType: string;
  voiceAsset: string;
}
