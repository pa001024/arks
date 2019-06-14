import * as _ from "lodash";
import { stage_table, item_table, character_table, enemy_handbook_table } from "../data";
import { DisplayDetailReward, LevelData } from "../data/stage.i";
import { purge } from "../common.util";
import { TMP_PREFIX } from "../var";
import { pathExistsSync, readFileSync } from "fs-extra";

const convertEnemy = async () => {};
