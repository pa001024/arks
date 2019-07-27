import build from "./build";
import clean from "./clean";
import sync from "./sync";

import { usage } from "yargs";

usage("$0 <cmd> [args]")
  .scriptName("arks-parser")
  .command(
    "build [mode]",
    "build from source",
    {
      mode: {
        type: "string",
        default: "",
        describe: "the mode name",
      },
    },
    async function(argv) {
      await build(argv.mode);
    }
  )
  .command(
    "sync [mode]",
    "sync online",
    {
      mode: {
        type: "string",
        default: "",
        describe: "the mode name",
      },
      force: {
        alias: "f",
        type: "boolean",
        default: "",
        describe: "force update",
      },
      skip: {
        type: "string",
        default: "",
        describe: "skip to some file name",
      },
    },
    async function(argv) {
      await sync(argv);
    }
  )
  .command("clean [module]", "clean online", {}, async function(argv) {
    await clean();
  })
  .help().argv;
