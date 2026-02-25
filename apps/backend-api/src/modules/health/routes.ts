import { Hono } from "hono";
import { describeRoute, resolver } from "hono-openapi";
import type { AppEnv } from "../../lib/app.js";
import { healthResponseSchema, liveResponseSchema } from "../../lib/schemas.js";

export const healthRoutes = new Hono<AppEnv>()
  .get(
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
    (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }),
  )
  .get(
    "/live",
    describeRoute({
      summary: "Liveness probe",
      description: "Returns alive status for Kubernetes/container health checks",
      responses: {
        200: {
          description: "API is alive",
          content: {
            "application/json": {
              schema: resolver(liveResponseSchema),
            },
          },
        },
      },
    }),
    (c) => c.json({ status: "alive" }),
  );
