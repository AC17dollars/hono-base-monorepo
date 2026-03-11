import { Hono } from "hono";
import { describeRoute, resolver } from "hono-openapi";
import type { AppEnv } from "../../lib/app.js";
import { healthResponseSchema } from "./schemas.js";
import { getHealthStatus } from "./services.js";

export const healthRoutes = new Hono<AppEnv>().get(
  "/",
  describeRoute({
    summary: "Health check",
    description: "Returns API health status and timestamp",
    responses: {
      200: {
        description: "API is healthy",
        content: {
          "application/json": {
            schema: resolver(healthResponseSchema),
          },
        },
      },
    },
  }),
  (c) => c.json(getHealthStatus()),
);
