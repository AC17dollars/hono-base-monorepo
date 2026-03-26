import { env } from "@repo/config";
import { serve } from "@hono/node-server";
import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { openAPIRouteHandler } from "hono-openapi";
import { getInstances, getLogger } from "@/lib/instances.js";
import type { AppEnv } from "@/lib/app.js";

// Initialize all service instances (DB, Mailer, Auth)
getInstances();
const logger = getLogger();

import { sessionMiddleware, loggerMiddleware } from "./middleware/index.js";
import { authRoutes } from "./modules/auth/index.js";
import { healthRoutes } from "./modules/health/index.js";

const app = new Hono<AppEnv>();

// Middlewares
app.use(
  "*",
  cors({
    origin: env.CORS_ORIGIN,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);
app.use("*", loggerMiddleware);
app.use("*", sessionMiddleware);

app.get("/", (c) => c.redirect("/docs"));

// Routes
app.route("/api/auth", authRoutes);
app.route("/api/health", healthRoutes);

// OpenAPI
app.get(
  "/openapi.json",
  openAPIRouteHandler(app, {
    documentation: {
      info: {
        title: "Backend API",
        version: "1.0.0",
        description: "API documentation for the Hono backend",
      },
    },
  }),
);

app.get(
  "/docs",
  Scalar({
    theme: "default",
    pageTitle: "API Documentation",
    sources: [
      { url: "/openapi.json", title: "API" },
      { url: "/api/auth/open-api/generate-schema", title: "Auth" },
    ],
  }),
);

// Server
serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    logger.info(`Server is running on: http://localhost:${info.port}`);
  },
);
