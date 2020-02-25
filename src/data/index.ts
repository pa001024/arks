import * as fs from "fs-extra";
import { DB_PREFIX, TMP_PREFIX } from "../var";
import { SkillTable } from "./skill.i";
import { ItemTable } from "./item.i";
import { SkinTable } from "./skin.i";
import { HandbookTeamTable } from "./team.i";
import { StageTable } from "./stage.i";
import { HandBookInfoTable } from "./handbook.i";
import { CharacterTable } from "./char.i";
import { EnemyDatabase, EnemyTable, EnemyHandbookTable } from "./enemy.i";
import { CharExtraTable } from "./extra.i";
import { CharwordTable } from "./charword.i";

// data cache
export let character_table: CharacterTable;
export let handbook_info_table: HandBookInfoTable;
export let handbook_team_table: HandbookTeamTable;
export let item_table: ItemTable;
export let skill_table: SkillTable;
export let skin_table: SkinTable;
export let stage_table: StageTable;
export let enemy_handbook_table: EnemyHandbookTable;
export let charword_table: CharwordTable;
// export let enemy_database: EnemyDatabase;
export let enemy_table: EnemyTable;
export let char_extra_table: CharExtraTable;
export let char_pool_table: { [key: string]: number };

export const loadData = async () => {
  // load data
  character_table = JSON.parse(await fs.readFile(DB_PREFIX + "excel/character_table.json", "utf-8"));
  handbook_info_table = JSON.parse(await fs.readFile(DB_PREFIX + "excel/handbook_info_table.json", "utf-8"));
  handbook_team_table = JSON.parse(await fs.readFile(DB_PREFIX + "excel/handbook_team_table.json", "utf-8"));
  item_table = JSON.parse(await fs.readFile(DB_PREFIX + "excel/item_table.json", "utf-8"));
  skill_table = JSON.parse(await fs.readFile(DB_PREFIX + "excel/skill_table.json", "utf-8"));
  skin_table = JSON.parse(await fs.readFile(DB_PREFIX + "excel/skin_table.json", "utf-8"));
  stage_table = JSON.parse(await fs.readFile(DB_PREFIX + "excel/stage_table.json", "utf-8"));
  enemy_handbook_table = JSON.parse(await fs.readFile(DB_PREFIX + "excel/enemy_handbook_table.json", "utf-8"));
  charword_table = JSON.parse(await fs.readFile(DB_PREFIX + "excel/charword_table.json", "utf-8"));
  const enemy_database = JSON.parse(await fs.readFile(DB_PREFIX + "levels/enemydata/enemy_database.json", "utf-8")) as EnemyDatabase;
  enemy_table = enemy_database.enemies.reduce((r, v) => ((r[v.Key] = v.Value), r), {} as EnemyTable);
  char_extra_table = JSON.parse(await fs.readFile(TMP_PREFIX + "onlineData.json", "utf-8"));
  char_pool_table = JSON.parse(await fs.readFile("src/patch/charmethod.json", "utf-8"));
};
