import Logger, { LOG_LEVELS } from "./src/Logger";

/**
 * This is just a test script to demonstrate how to use the Logger class. You can modify it as needed.
 */

class test extends Logger {
  emoji = "😊";
  constructor() {
    super();
  }
}
const logger = new test();

function makeMapWithDepth(count: number, depth: number): Map<number, any> {
  const map = new Map<number, any>();
  if (depth <= 0) return map;
  for (let i = 0; i < count; i++) {
    map.set(i, makeMapWithDepth(count, depth - 1));
  }
  return map;
}
const map = makeMapWithDepth(2, 10);

logger.debug(`Map size: ${map.size}:`, map);
logger.info(`Logger instance created`);
logger.error(`An error occurred`);
logger.warn(`A warning occurred`);
