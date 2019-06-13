import { stage_table } from "../data";
import { Item } from "../data/item.i";
import { purge } from "../util";

export interface ItemFlat {
  name: string;
  rarity: number;
  iconid: string;
  description: string;
  stackiconid: string;
  usage: string;
  obtainapproach: string;
  itemtype: string;
  dropBy: string;
  craftBy: string;
}

export const translateItem = (item: Item) => {
  return purge({
    name: item.name,
    rarity: item.rarity,
    iconid: item.iconId,
    description: item.description.replace(/\\n/g, "\n"),
    stackiconid: item.stackIconId,
    usage: item.usage,
    obtainapproach: item.obtainApproach,
    itemtype: item.itemType,
    dropBy: item.stageDropList
      .map(v => {
        const key = `[[${stage_table.stages[v.stageId].code}]]`;
        enum DropRateTable {
          SOMETIMES = "罕见",
          OFTEN = "小概率",
          USUAL = "概率",
          ALMOST = "大概率",
          ALWAYS = "固定掉落",
        }
        const rate = DropRateTable[v.occPer];
        return (rate ? key + "," + rate : key) + ",";
      })
      .join(";"),
    craftBy: item.buildingProductList
      .map(v => {
        enum RoomType {
          MANUFACTURE = "制造站",
          WORKSHOP = "加工站",
        }
        return RoomType[v.roomType];
      })
      .join(","),
  }) as ItemFlat;
};