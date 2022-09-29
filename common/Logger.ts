import { getLogger, handlers, LevelName, setup } from "std/log/mod.ts";
import { LOGGING_LEVEL } from "../common/config.ts";

const LEVEL = LOGGING_LEVEL as LevelName;

setup({
  handlers: {
    console: new handlers.ConsoleHandler(LEVEL),
  },
  loggers: {
    default: {
      level: LEVEL,
      handlers: ["console"],
    },
  },
});

export const LOGGER = getLogger();
