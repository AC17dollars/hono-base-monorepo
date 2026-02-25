import type { Mailer } from "../config.js";
import { sendEmail } from "../sendEmail.js";

export interface PasswordResetOptions {
  to: string;
  url: string;
  name?: string;
  expiresIn?: string;
  appName?: string;
}

export async function sendPasswordResetEmail(options: PasswordResetOptions, mailer: Mailer) {
  const { to, url, name, expiresIn = "1 hour", appName = "Turbo Base" } = options;

  const subject = `Reset your ${appName} password`;
  const firstName = name ? ` ${name}` : "";

  await sendEmail(
    {
      to,
      subject,
      text: `Hi${firstName}, click here to reset your password: ${url}. This link will expire in ${expiresIn}.`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reset your password</h2>
          <p>Hi${firstName},</p>
          <p>We received a request to reset your password for your ${appName} account. Click the button below to choose a new one. This link will expire in <strong>${expiresIn}</strong>.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${url}" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:
            <br />
            <a href="${url}">${url}</a>
          </p>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            If you didn't request a password reset, you can safely ignore this email.
          </p>
          <p style="margin-top: 32px; color: #6b7280; font-size: 14px;">
            — The ${appName} Team
          </p>
        </div>
      `,
    },
    mailer,
  );
}
