import { createDb } from "@repo/db";
import { createMailer } from "@repo/mail";
import { createAuth } from "@repo/auth";

// These will be initialized in the entry point
export let db: ReturnType<typeof createDb>;
export let mailer: ReturnType<typeof createMailer>;
export let auth: ReturnType<typeof createAuth>;

export function initInstances() {
  db = createDb(process.env.DATABASE_URL!);

  mailer = createMailer({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT!),
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASSWORD!,
    },
    from: process.env.SMTP_FROM!,
  });

  auth = createAuth({
    db,
    mailer,
    secret: process.env.BETTER_AUTH_SECRET!,
    url: process.env.BETTER_AUTH_URL!,
  });
}
