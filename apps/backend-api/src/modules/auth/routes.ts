import { Hono } from "hono";
import { auth } from "../../lib/instances.js";
import type { AppEnv } from "../../lib/app.js";

export const authRoutes = new Hono<AppEnv>().on(["POST", "GET"], "/*", (c) =>
  auth.handler(c.req.raw),
);
