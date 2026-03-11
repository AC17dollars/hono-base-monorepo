import pino from "pino";

export type Logger = pino.Logger;

export interface LoggerOptions {
  /** Log level (default: 'info') */
  level?: pino.Level;
  /** Use pino-pretty for human-readable output (dev mode). Pass from env.NODE_ENV !== "production" */
  dev?: boolean;
}

/**
 * Creates a pino logger instance.
 * - Development (dev: true): Uses pino-pretty transport for human-readable, colorized output
 * - Production (dev: false): Uses default JSON output for log aggregation
 */
export function createLogger(options?: LoggerOptions): Logger {
  const isDev = options?.dev ?? false;

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
