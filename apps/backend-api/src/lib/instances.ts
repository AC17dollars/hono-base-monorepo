import { createDb } from "@repo/db";
import type { DbClient } from "@repo/db";
import type { Mailer } from "@repo/mail";
import { createAuth } from "@repo/auth";
import type { Auth } from "@repo/auth";
import { createQueueClient, createQueueMailer } from "@repo/queue";
import { env } from "@repo/config";

type Instances = {
  db: DbClient;
  mailer: Mailer;
  auth: Auth;
};

let _instances: Instances | null = null;

export function getInstances(): Instances {
  if (!_instances) {
    const db = createDb(env.DATABASE_URL);

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

    _instances = { db, mailer, auth };
  }

  return _instances;
}

export const getDb = (): DbClient => getInstances().db;
export const getMailer = (): Mailer => getInstances().mailer;
export const getAuth = (): Auth => getInstances().auth;
