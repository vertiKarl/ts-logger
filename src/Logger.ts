import fs from "fs";

const ERROR = 0b1;
const WARN = 0b10;
const INFO = 0b100;
const DEBUG = 0b1000;
const ALL = ERROR | WARN | INFO | DEBUG;
const DEFAULT = ERROR | WARN | INFO;
export const LOG_LEVELS = {
  ERROR,
  WARN,
  INFO,
  DEBUG,
  ALL,
  DEFAULT,
};

function convertToString(data: any): string {
  // This function converts any data to a string.
  return JSON.stringify(
    data,
    (key, value) => {
      if (value instanceof Map || value instanceof Set) {
        return Object.fromEntries(value);
      } else {
        return value;
      }
    },
    2
  );
}

// Generate tsDoc comment for Logger class
/**
 * Logger class for logging messages pretty and optionally to a file.
 * @param emoji emoji to use for logging messages
 * @param logLevel the level of logging to use
 * @param toFile whether to log to a file or not
 */
export default class Logger {
  constructor(
    private emoji: string,
    private toFile = false,
    private logLevel: number = DEFAULT
  ) {
    if (Number(process.env.DEBUG as String) === 1) {
      this.logLevel |= DEBUG;
    }
  }

  get time(): string {
    const date = new Date();
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  }

  /**
   * Appends content to end of log file
   * @param data content to log to file
   */
  private async log2file(...data: any): Promise<void> {
    if (this.toFile)
      fs.appendFileSync("./latest.log", convertToString(data) + "\n", {
        encoding: "utf-8",
      });
  }

  /**
   * Only outputs to console when isDebug is true
   * @param content Content to print to debug out
   */
  debug(...content: any) {
    if (!(this.logLevel & DEBUG)) return;
    const time = this.time;
    console.debug(this.emoji + " [DEBUG] [" + time + "]", ...content);
    this.log2file([`${this.emoji} [${time}]`, ...content]);
  }

  /**
   * @param content Content to log
   */
  info(...content: any) {
    if (!(this.logLevel & INFO)) return;
    const time = this.time;
    console.log(this.emoji + " [" + time + "]", ...content);

    this.log2file([`${this.emoji} [${time}]`, ...content]);
  }

  /**
   * @param content Content to warn about
   */
  warn(...content: any) {
    if (!(this.logLevel & WARN)) return;
    const time = this.time;

    console.warn(
      `\u001b[30;1m\u001b[48;5;208m${this.emoji}\u001b[0m [${time}]`,
      ...content
    );

    this.log2file([`${this.emoji} [${time}]`, ...content]);
  }

  /**
   * @param content Content to error out and log to file
   */
  error(...content: any) {
    if (!(this.logLevel & ERROR)) return;
    const time = this.time;
    console.error(
      `\u001b[1m\u001b[41;1m\u001b[38;5;231m${this.emoji}\x1b[0m [${time}]`,
      ...content
    );

    this.log2file([`${this.emoji} [${time}]`, ...content]);
  }
}
