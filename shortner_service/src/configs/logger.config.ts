import pino from "pino";
import { env } from "./env.config";

const isDevelopment = env.NODE_ENV !== "production";

export const logger = pino({
  level: env.LOG_LEVEL || "info",
  transport: isDevelopment
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
          singleLine: false,
        },
      }
    : undefined,
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
});
