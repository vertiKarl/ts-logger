// Stolen from: https://github.com/TypeStrong/ts-node/blob/main/scripts/prepack.mjs

const { npm_execpath } = process.env;

console.log("Running prepack...");

// prepack is executed by user's package manager when they install from git
// So cannot assume yarn

if (process.env.TS_NODE_SKIP_PREPACK == null) {
  console.log("Prepacking");
  const crossSpawn = await import("cross-spawn");
  const result = crossSpawn.sync(npm_execpath, ["run", "prepack-worker"], {
    stdio: "inherit",
  });
  process.exit(result.status);
}
