import { Hono } from "hono";
import { getAuth } from "@/lib/instances.js";
import type { AppEnv } from "@/lib/app.js";

export const authRoutes = new Hono<AppEnv>().on(["POST", "GET"], "/*", (c) =>
  getAuth().handler(c.req.raw),
);
