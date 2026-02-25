import { config } from "@dotenvx/dotenvx";
config();

import { serve } from "@hono/node-server";
import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { openAPIRouteHandler } from "hono-openapi";
import { initInstances } from "./lib/instances.js";
import type { AppEnv } from "./lib/app.js";

// Initialize all service instances (DB, Mailer, Auth)
initInstances();

import { sessionMiddleware } from "./middleware/session.js";
import { authRoutes } from "./modules/auth/index.js";
import { healthRoutes } from "./modules/health/index.js";
import { sessionRoutes } from "./modules/session/index.js";

const app = new Hono<AppEnv>();

app.use(
  "*",
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.use("*", sessionMiddleware);

app.get("/", (c) => c.text("Hello Hono!"));

app.route("/api/auth", authRoutes);
app.route("/api/health", healthRoutes);
app.route("/api/session", sessionRoutes);

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
    theme: "saturn",
    pageTitle: "API Documentation",
    sources: [
      { url: "/openapi.json", title: "API" },
      { url: "/api/auth/open-api/generate-schema", title: "Auth" },
    ],
  }),
);

const port = Number(process.env.PORT) || 3000;

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
