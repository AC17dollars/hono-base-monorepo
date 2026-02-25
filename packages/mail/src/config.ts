import type { Transporter } from "nodemailer";
import nodemailer from "nodemailer";
import { EmailError } from "./errors.js";
import { type SendEmailOptions, sendEmail } from "./sendEmail.js";
import {
  type EmailOTPOptions,
  type PasswordResetOptions,
  type WelcomeMessageOptions,
  sendEmailOTP,
  sendPasswordResetEmail,
  sendWelcomeMessage,
} from "./templates/index.js";

export interface MailConfig {
  host: string;
  port: number;
  secure?: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

export interface Mailer {
  sendEmail(options: SendEmailOptions): Promise<void>;
  sendWelcomeMessage(options: WelcomeMessageOptions): Promise<void>;
  sendPasswordResetEmail(options: PasswordResetOptions): Promise<void>;
  sendEmailOTP(options: EmailOTPOptions): Promise<void>;
  transporter: Transporter;
  options: { from: string };
}

/**
 * Creates a new Mailer instance with the given configuration.
 *
 * @example
 * const mailer = createMailer({
 *   host: process.env.SMTP_HOST!,
 *   port: Number(process.env.SMTP_PORT!),
 *   auth: { ... },
 *   from: "test@example.com"
 * });
 */
export function createMailer(config: MailConfig): Mailer {
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure ?? config.port === 465,
    auth: config.auth,
  });

  const mailer: Mailer = {
    transporter,
    options: { from: config.from },
    sendEmail: (options) => sendEmail(options, mailer),
    sendWelcomeMessage: (options) => sendWelcomeMessage(options, mailer),
    sendPasswordResetEmail: (options) => sendPasswordResetEmail(options, mailer),
    sendEmailOTP: (options) => sendEmailOTP(options, mailer),
  };

  return mailer;
}
