export { createMailer } from "./config.js";
export type { MailConfig, Mailer } from "./config.js";

export { sendEmail } from "./sendEmail.js";
export type { SendEmailOptions } from "./sendEmail.js";

export { EmailError } from "./errors.js";

export { sendWelcomeMessage, sendPasswordResetEmail, sendEmailOTP } from "./templates/index.js";
export type {
  WelcomeMessageOptions,
  PasswordResetOptions,
  EmailOTPOptions,
} from "./templates/index.js";
