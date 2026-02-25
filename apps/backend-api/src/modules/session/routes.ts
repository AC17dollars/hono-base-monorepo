import { Hono } from "hono";
import { describeRoute, resolver } from "hono-openapi";
import type { AppEnv } from "../../lib/app.js";
import { sessionResponseSchema } from "../../lib/schemas.js";

export const sessionRoutes = new Hono<AppEnv>().get(
  "/",
  describeRoute({
    summary: "Get current session",
    description: "Returns the authenticated user and session. Returns 401 if not authenticated.",
    responses: {
      200: {
        description: "Current user and session",
        content: {
          "application/json": {
            schema: resolver(sessionResponseSchema),
          },
        },
      },
      401: {
        description: "Not authenticated",
        content: {
          "application/json": {
            schema: resolver(sessionResponseSchema),
          },
        },
      },
    },
  }),
  (c) => {
    const user = c.get("user");
    const session = c.get("session");

    if (!user) {
      return c.json({ user: null, session: null }, 401);
    }

    return c.json({ user, session });
  },
);
