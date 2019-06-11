import * as fs from "fs-extra";
import { TARGET_PREFIX } from "./var";

export default async () => {
  await fs.remove(TARGET_PREFIX);
  console.log("[clean] All Finished");
};
