/// <reference types="node" />
import { defineConfig } from "drizzle-kit";
import { env } from "@repo/config";

export default defineConfig({
  out: "./drizzle",
  schema: "./dist/schema/index.mjs",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
