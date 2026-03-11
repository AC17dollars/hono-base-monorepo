import { Hono } from "hono";
import { describeRoute, resolver } from "hono-openapi";
import { getAuth } from "../../lib/instances.js";
import type { AppEnv } from "../../lib/app.js";
import { sessionResponseSchema } from "./schemas.js";
import { getSessionData } from "./services.js";

export const authRoutes = new Hono<AppEnv>()
  .on(["POST", "GET"], "/*", (c) => getAuth().handler(c.req.raw))
  .get(
    "/session",
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
      const data = getSessionData(c);
      if (!data.user) {
        return c.json(data, 401);
      }
      return c.json(data);
    },
  );
