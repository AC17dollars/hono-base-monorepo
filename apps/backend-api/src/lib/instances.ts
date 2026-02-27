import { createDb } from "@repo/db";
import type { DbClient } from "@repo/db";
import { createMailer } from "@repo/mail";
import type { Mailer } from "@repo/mail";
import { createAuth } from "@repo/auth";
import type { Auth } from "@repo/auth";
import { env } from "@repo/config/backend-api";

type Instances = {
  db: DbClient;
  mailer: Mailer;
  auth: Auth;
};

let _instances: Instances | null = null;

export function getInstances(): Instances {
  if (!_instances) {
    const db = createDb(env.DATABASE_URL);

    const mailer = createMailer({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
      },
      from: env.SMTP_FROM,
    });

    const auth = createAuth({
      db,
      mailer,
      secret: env.BETTER_AUTH_SECRET,
      url: env.BETTER_AUTH_URL,
    });

    _instances = { db, mailer, auth };
  }

  return _instances;
}

export const getDb = (): DbClient => getInstances().db;
export const getMailer = (): Mailer => getInstances().mailer;
export const getAuth = (): Auth => getInstances().auth;
