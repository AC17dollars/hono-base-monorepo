import type { Mailer } from "../config.js";
import { sendEmail } from "../sendEmail.js";

export interface EmailOTPOptions {
  to: string;
  otp: string;
  purpose: "verification" | "password-reset" | "two-factor";
  expiresIn?: string;
  appName?: string;
}

export async function sendEmailOTP(options: EmailOTPOptions, mailer: Mailer) {
  const { to, otp, purpose, expiresIn = "10 minutes", appName = "Turbo Base" } = options;

  let subject = "";
  let message = "";

  switch (purpose) {
    case "verification":
      subject = `Verify your email for ${appName}`;
      message = `Your verification code is ${otp}. It will expire in ${expiresIn}.`;
      break;
    case "password-reset":
      subject = `Password reset code for ${appName}`;
      message = `Your password reset code is ${otp}. It will expire in ${expiresIn}.`;
      break;
    case "two-factor":
      subject = `Two-factor authentication code for ${appName}`;
      message = `Your two-factor authentication code is ${otp}. It will expire in ${expiresIn}.`;
      break;
  }

  await sendEmail(
    {
      to,
      subject,
      text: message,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>${subject}</h2>
          <p>${message}</p>
          <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    },
    mailer,
  );
}
