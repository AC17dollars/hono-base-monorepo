import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP, openAPI, twoFactor } from "better-auth/plugins";
import type { DbClient } from "@repo/db";
import type { Mailer } from "@repo/mail";

export interface AuthOptions {
  db: DbClient;
  mailer: Mailer;
  secret: string;
  url: string;
  appName?: string;
}

/**
 * Creates a Better Auth instance with the provided configuration.
 *
 * @example
 * const auth = createAuth({
 *   db,
 *   mailer,
 *   secret: process.env.BETTER_AUTH_SECRET!,
 *   url: process.env.BETTER_AUTH_URL!
 * });
 */
export function createAuth(options: AuthOptions) {
  const { db, mailer, secret, url, appName = "Turbo Base" } = options;

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    secret,
    baseURL: url,
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
    },
    emailVerification: {
      sendVerificationEmail: async (email) => {
        await mailer.sendEmail({
          to: email.user.email,
          subject: "Verification Email",
          text: `Your verification link is ${email.url}`,
          html: `<p>Your verification link is <a href="${email.url}">${email.url}</a></p>`,
        });
      },
    },
    plugins: [
      openAPI(),
      twoFactor(),
      emailOTP({
        sendVerificationOTP: async (data, _ctx) => {
          await mailer.sendEmailOTP({
            to: data.email,
            otp: data.otp,
            purpose: "verification",
            expiresIn: "1 hour",
            appName,
          });
        },
      }),
    ],
  });
}

export type Auth = ReturnType<typeof createAuth>;
