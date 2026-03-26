import { createDb, type DbClient } from "@repo/db";
import type { Mailer } from "@repo/mail";
import { createAuth, type Auth } from "@repo/auth";
import { createQueueClient, createQueueMailer } from "@repo/queue";
import { env } from "@repo/config";
import { createLogger, type Logger } from "@repo/logger";

type Instances = {
  db: DbClient;
  mailer: Mailer;
  auth: Auth;
  logger: Logger;
};

let _instances: Instances | null = null;

export function getInstances(): Instances {
  if (!_instances) {
    const db = createDb(env.DATABASE_URL);
    const logger = createLogger({
      level: env.NODE_ENV === "production" ? "info" : "debug",
      dev: env.NODE_ENV !== "production",
    });
    const queue = createQueueClient({ redisUrl: env.REDIS_URL });
    const mailer = createQueueMailer(queue);

    const auth = createAuth({
      db,
      mailer,
      secret: env.BETTER_AUTH_SECRET,
      url: env.BETTER_AUTH_URL,
      ...(env.GOOGLE_CLIENT_ID &&
        env.GOOGLE_CLIENT_SECRET && {
          google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
          },
        }),
    });

    _instances = { db, mailer, auth, logger };
  }

  return _instances;
}

export const getDb = (): DbClient => getInstances().db;
export const getMailer = (): Mailer => getInstances().mailer;
export const getAuth = (): Auth => getInstances().auth;
export const getLogger = (): Logger => getInstances().logger;
