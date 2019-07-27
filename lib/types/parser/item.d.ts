import { Item } from "../data/item.i";
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
export declare const translateItem: (item: Item) => ItemFlat;
//# sourceMappingURL=item.d.ts.map