import { createMiddleware } from "hono/factory";
import { getAuth } from "@/lib/instances.js";
import type { AppEnv } from "@/lib/app.js";

export const sessionMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const session = await getAuth().api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    await next();
    return;
  }

  c.set("user", session.user);
  c.set("session", session.session);

  await next();
});
