import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from "@dotenvx/dotenvx";
import * as schema from "./schema/schema.js";

config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
});

export const db = drizzle(pool, { schema });
