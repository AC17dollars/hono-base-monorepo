import { createMiddleware } from "hono/factory";
import { createLogger } from "@repo/logger";
import type { AppEnv } from "../lib/app.js";

export const loggerMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const startTime = performance.now();
  const reqId = c.req.header("x-request-id") ?? crypto.randomUUID();

  await next();

  const responseTime = Math.round(performance.now() - startTime);
  const url = new URL(c.req.url);

  createLogger().info({
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
