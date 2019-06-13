import * as fs from "fs-extra";
import { TMP_PREFIX } from "../var";
import { SkillTable } from "./skill.i";
import { ItemTable } from "./item.i";
import { SkinTable } from "./skin.i";
import { HandbookTeamTable } from "./team.i";
import { StageTable } from "./state.i";
import { HandBookTable } from "./handbook.i";
import { CharacterTable } from "./char.i";

// data cache
export let character_table: CharacterTable;
export let handbook_info_table: HandBookTable;
export let handbook_team_table: HandbookTeamTable;
export let item_table: ItemTable;
export let skill_table: SkillTable;
export let skin_table: SkinTable;
export let stage_table: StageTable;

export const loadData = async () => {
  // load data
  character_table = JSON.parse(await fs.readFile(TMP_PREFIX + "ArknightsGameData/excel/character_table.json", "utf-8"));
  handbook_info_table = JSON.parse(await fs.readFile(TMP_PREFIX + "ArknightsGameData/excel/handbook_info_table.json", "utf-8"));
  handbook_team_table = JSON.parse(await fs.readFile(TMP_PREFIX + "ArknightsGameData/excel/handbook_team_table.json", "utf-8"));
  item_table = JSON.parse(await fs.readFile(TMP_PREFIX + "ArknightsGameData/excel/item_table.json", "utf-8"));
  skill_table = JSON.parse(await fs.readFile(TMP_PREFIX + "ArknightsGameData/excel/skill_table.json", "utf-8"));
  skin_table = JSON.parse(await fs.readFile(TMP_PREFIX + "ArknightsGameData/excel/skin_table.json", "utf-8"));
  stage_table = JSON.parse(await fs.readFile(TMP_PREFIX + "ArknightsGameData/excel/stage_table.json", "utf-8"));
};
