import nodemailer from "nodemailer";
import { env } from "./env";

// Create a transporter using Gmail SMTP
export const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_APP_PASSWORD,
  },
});

// Send verification email function
export const sendVerificationEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    const info = await mailer.sendMail({
      from: env.GMAIL_FROM_NAME ? `${env.GMAIL_FROM_NAME} <${env.GMAIL_USER}>` : env.GMAIL_USER,
      to,
      subject,
      html,
    });
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};
