export interface ItemTable {
    items: {
        [key: string]: Item;
    };
}
export interface Item {
    itemId: string;
    name: string;
    description: string;
    rarity: number;
    iconId: string;
    overrideBkg?: any;
    stackIconId?: string;
    sortId: number;
    usage: string;
    obtainApproach?: string;
    itemType: string;
    stageDropList: StageDropList[];
    buildingProductList: BuildingProductList[];
}
export interface BuildingProductList {
    roomType: string;
    formulaId: string;
}
export interface StageDropList {
    stageId: string;
    occPer: string;
}
//# sourceMappingURL=item.i.d.ts.map