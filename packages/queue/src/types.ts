import type {
  SendEmailOptions,
  EmailOTPOptions,
  PasswordResetOptions,
  WelcomeMessageOptions,
} from "@repo/mail";

/** Job names for the mail queue */
export const MAIL_QUEUE_NAME = "mail";

export type MailJobType =
  | { name: "sendEmail"; data: SendEmailOptions }
  | { name: "sendEmailOTP"; data: EmailOTPOptions }
  | { name: "sendPasswordResetEmail"; data: PasswordResetOptions }
  | { name: "sendWelcomeMessage"; data: WelcomeMessageOptions };

export type MailJobData = MailJobType["data"];
