import type { Context, Next } from "hono";
import { auth } from "../lib/instances.js";
import type { AppEnv } from "../lib/app.js";

export async function sessionMiddleware(c: Context<AppEnv, "*", {}>, next: Next) {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    await next();
    return;
  }

  c.set("user", session.user);
  c.set("session", session.session);
  await next();
}
