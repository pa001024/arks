import build from "./build";
import clean from "./clean";
import sync from "./sync";

const main = async () => {
  if (process.argv[2] === "sync") {
    await sync();
  } else if (process.argv[2] === "clean") {
    await clean();
  } else {
    await build(process.argv[2] === "dev");
  }
};

main();
