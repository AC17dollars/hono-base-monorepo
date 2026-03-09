import type { Env, MiddlewareHandler } from "hono";
import { createMiddleware } from "hono/factory";
import { createLogger } from "./logger.js";
import type { Logger } from "./logger.js";

export interface LoggerMiddlewareOptions {
  logger?: Logger;
}

export const loggerMiddleware = <E extends Env = any>(
  options?: LoggerMiddlewareOptions
): MiddlewareHandler<E, any, {}> => {
  const logger = options?.logger ?? createLogger();

  return createMiddleware(async (c, next) => {
    const startTime = performance.now();
    const reqId = c.req.header("x-request-id") ?? crypto.randomUUID();

    await next();

    const responseTime = Math.round(performance.now() - startTime);
    const url = new URL(c.req.url);

    logger.info({
      reqId,
      req: {
        method: c.req.method,
        url: c.req.url,
        path: url.pathname,
      },
      res: {
        status: c.res.status,
      },
      responseTime,
      msg: "request completed",
    });
  });
};