import { createMiddleware } from "hono/factory";
import { getLogger } from "@/lib/instances.js";
import type { AppEnv } from "@/lib/app.js";

export const loggerMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const startTime = performance.now();
  const reqId = c.req.header("x-request-id") ?? crypto.randomUUID();

  await next();

  const responseTime = Math.round(performance.now() - startTime);
  const url = new URL(c.req.url);

  if (c.res.status < 400) {
    getLogger().info({
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
  } else {
    getLogger().error({
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
      msg: "request failed",
    });
  }
});
