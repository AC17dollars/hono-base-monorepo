import pino from "pino";

export type Logger = pino.Logger;

export interface LoggerOptions {
  /** Log level (default: 'info') */
  level?: pino.Level;
}

/**
 * Creates a pino logger instance.
 * - Development: Uses pino-pretty transport for human-readable, colorized output
 * - Production: Uses default JSON output for log aggregation
 */
export function createLogger(options?: LoggerOptions): Logger {
  const isDev = process.env.NODE_ENV !== "production";

  return pino({
    level: options?.level ?? "info",
    ...(isDev && {
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
        },
      },
    }),
  });
}
