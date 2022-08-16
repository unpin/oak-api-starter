import { getLogger, handlers, LevelName, setup } from "std/log/mod.ts";
import { LOGGING_LEVEL } from "../config/config.ts";

const LEVEL = LOGGING_LEVEL as LevelName || "NOTSET";
// File Logger Configuration
const FILENAME = "./logs/log.txt";
const MAX_BYTES = 1024 * 1024 * 5;
const MAX_BACKUP_COUNT = 3;
const FORMATTER = "[{levelName}] {datetime} {msg}";

await setup({
  handlers: {
    console: new handlers.ConsoleHandler("DEBUG"),
    file: new handlers.RotatingFileHandler("ERROR", {
      filename: FILENAME,
      formatter: FORMATTER,
      maxBytes: MAX_BYTES,
      maxBackupCount: MAX_BACKUP_COUNT,
    }),
  },
  loggers: {
    default: {
      level: LEVEL,
      handlers: ["console", "file"],
    },
  },
});

export const LOGGER = getLogger();
