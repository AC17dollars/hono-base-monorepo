import type { Context } from "hono";
import type { AppEnv } from "../../lib/app.js";
import type { SessionResponse } from "./schemas.js";

export const getSessionData = (c: Context<AppEnv>): SessionResponse => {
  const user = c.get("user");
  const session = c.get("session");

  if (!user || !session) {
    return { user: null, session: null };
  }

  return { user, session };
};
