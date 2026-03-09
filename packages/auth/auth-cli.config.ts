/**
 * Central auth config for better-auth schema generation.
 * Used by: pnpm auth:generate (from root)
 * Env loaded from root .env via dotenvx
 */
import { createAuth } from "@repo/auth";
import { createDb } from "@repo/db";
import { createMailer } from "@repo/mail";
import { env } from "@repo/config/backend-api";

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

export const auth = createAuth({
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
