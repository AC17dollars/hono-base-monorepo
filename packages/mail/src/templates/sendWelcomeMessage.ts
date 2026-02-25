import type { Mailer } from "../config.js";
import { sendEmail } from "../sendEmail.js";

export interface WelcomeMessageOptions {
  to: string;
  name: string;
  loginUrl: string;
  appName?: string;
}

export async function sendWelcomeMessage(options: WelcomeMessageOptions, mailer: Mailer) {
  const { to, name, loginUrl, appName = "Turbo Base" } = options;

  const subject = `Welcome to ${appName}!`;

  await sendEmail(
    {
      to,
      subject,
      text: `Hi ${name}, welcome to ${appName}! You can log in here: ${loginUrl}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to ${appName}!</h2>
          <p>Hi ${name},</p>
          <p>We're excited to have you on board! Your account has been successfully created.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginUrl}" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Log in to your account
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            If you have any questions, feel free to reply to this email.
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
