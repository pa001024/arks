export interface HandBookInfoTable {
  handbookDict: { [key: string]: HandBookInfo };
}

export interface HandBookInfo {
  charID: string;
  drawName: string;
  infoName: string;
  storyTextAudio: StoryTextAudio[];
}

export interface StoryTextAudio {
  stories: [Story];
  storyTitle: string;
  unLockorNot: boolean;
}

export interface Story {
  storyText: string;
  unLockType: number;
  unLockParam: string;
  unLockString: string;
}
