import type { SendMailOptions } from "nodemailer";
import type { Mailer } from "./config.js";
import { EmailError } from "./errors.js";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  /** Override the default from address set in createMailer(). */
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: SendMailOptions["attachments"];
}

export async function sendEmail(options: SendEmailOptions, mailer: Mailer): Promise<void> {
  const from = options.from ?? mailer.options.from;

  try {
    const mailOptions: SendMailOptions = {
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      ...(from && { from }),
      replyTo: options.replyTo,
      cc: options.cc,
      bcc: options.bcc,
      attachments: options.attachments,
    };

    await mailer.transporter.sendMail(mailOptions);
  } catch (error) {
    throw new EmailError(
      `Failed to send email: ${error instanceof Error ? error.message : String(error)}`,
      error,
    );
  }
}
