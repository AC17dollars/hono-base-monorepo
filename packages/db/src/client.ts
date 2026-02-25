import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema/index.js";

export type DbClient = ReturnType<typeof createDb>;

/**
 * Creates a new Drizzle database client bound to the given connection string.
 * This is the preferred way to instantiate the database in an application.
 *
 * @example
 * const db = createDb(process.env.DATABASE_URL!);
 */
export function createDb(connectionString: string, poolSize = 10) {
  const pool = new Pool({ connectionString, max: poolSize });
  return drizzle(pool, { schema });
}
