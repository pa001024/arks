import * as fs from "fs-extra";
import { TMP_PREFIX } from "../var";
import { SkillTable } from "./skill.i";
import { ItemTable } from "./item.i";
import { SkinTable } from "./skin.i";
import { HandbookTeamTable } from "./team.i";
import { StageTable } from "./stage.i";
import { HandBookTable } from "./handbook.i";
import { CharacterTable } from "./char.i";
import { EnemyDatabase, EnemyTable, EnemyHandbookTable } from "./enemy.i";

// data cache
export let character_table: CharacterTable;
export let handbook_info_table: HandBookTable;
export let handbook_team_table: HandbookTeamTable;
export let item_table: ItemTable;
export let skill_table: SkillTable;
export let skin_table: SkinTable;
export let stage_table: StageTable;
export let enemy_handbook_table: EnemyHandbookTable;
// export let enemy_database: EnemyDatabase;
export let enemy_table: EnemyTable;

export const loadData = async () => {
  // load data
  character_table = JSON.parse(await fs.readFile(TMP_PREFIX + "ArknightsGameData/excel/character_table.json", "utf-8"));
  handbook_info_table = JSON.parse(await fs.readFile(TMP_PREFIX + "ArknightsGameData/excel/handbook_info_table.json", "utf-8"));
  handbook_team_table = JSON.parse(await fs.readFile(TMP_PREFIX + "ArknightsGameData/excel/handbook_team_table.json", "utf-8"));
  item_table = JSON.parse(await fs.readFile(TMP_PREFIX + "ArknightsGameData/excel/item_table.json", "utf-8"));
  skill_table = JSON.parse(await fs.readFile(TMP_PREFIX + "ArknightsGameData/excel/skill_table.json", "utf-8"));
  skin_table = JSON.parse(await fs.readFile(TMP_PREFIX + "ArknightsGameData/excel/skin_table.json", "utf-8"));
  stage_table = JSON.parse(await fs.readFile(TMP_PREFIX + "ArknightsGameData/excel/stage_table.json", "utf-8"));
  enemy_handbook_table = JSON.parse(await fs.readFile(TMP_PREFIX + "ArknightsGameData/excel/enemy_handbook_table.json", "utf-8"));
  const enemy_database = JSON.parse(await fs.readFile(TMP_PREFIX + "ArknightsGameData/levels/enemydata/enemy_database.json", "utf-8")) as EnemyDatabase;
  enemy_table = enemy_database.enemies.reduce((r, v) => ((r[v.Key] = v.Value), r), {} as EnemyTable);
};
