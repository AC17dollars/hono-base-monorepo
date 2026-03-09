import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI, twoFactor } from "better-auth/plugins";
import type { DbClient } from "@repo/db";
import type { Mailer } from "@repo/mail";

export interface AuthOptions {
  db: DbClient;
  mailer: Mailer;
  secret: string;
  url: string;
  appName?: string;
  /** Google OAuth credentials for SSO. When provided, Google sign-in is enabled. */
  google?: {
    clientId: string;
    clientSecret: string;
  };
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
  const { db, mailer, secret, url, appName = "Turbo Base", google } = options;

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    secret,
    baseURL: url,
    appName,
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
    ...(google && {
      socialProviders: {
        google: {
          clientId: google.clientId,
          clientSecret: google.clientSecret,
        },
      },
    }),
    plugins: [
      openAPI(),
      twoFactor({
        issuer: appName,
        otpOptions: {
          sendOTP: async ({ user, otp }, _ctx) => {
            if (!user.email) {
              throw new Error("User email is required for OTP fallback");
            }
            await mailer.sendEmailOTP({
              to: user.email,
              otp,
              purpose: "two-factor",
              expiresIn: "10 minutes",
              appName,
            });
          },
        },
      }),
    ],
  });
}

export type Auth = ReturnType<typeof createAuth>;
