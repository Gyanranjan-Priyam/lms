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

// Generate verification email HTML template
const generateVerificationEmailHTML = (verificationCode: string) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; color: #333333;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="padding: 50px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #ffffff; border-radius: 14px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 48px 40px 36px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.4px;">Email Verification</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 15px;">Secure your account in seconds</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 50px 40px 40px;">
              <p style="margin: 0 0 24px; font-size: 16px;">Hello,</p>
              <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.6; color: #444444;">
                We received a request to verify your email address. Use the code below to complete your verification.
              </p>

              <!-- Verification Code -->
              <div style="text-align: center; margin-bottom: 40px;">
                <div style="display: inline-block; padding: 26px 40px; border-radius: 10px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);">
                  <span style="font-size: 38px; font-weight: 700; color: #ffffff; letter-spacing: 8px; font-family: 'Roboto Mono', monospace;">${verificationCode}</span>
                </div>
              </div>

              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #444444;">
                This code will expire in 10 minutes. If you did not request it, you can safely ignore this email.
              </p>

              <!-- Security Info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 32px; background-color: #f8fafc; border-left: 4px solid #4f46e5; border-radius: 6px;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.6;">
                      <strong style="color: #222222;">Security Reminder:</strong> Never share your verification code with anyone. Our team will never ask for it.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px 40px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #666666;">Need help? Contact us at 
                <a href="mailto:${env.GMAIL_USER}" style="color: #4f46e5; text-decoration: none;">${env.GMAIL_USER}</a>
              </p>
              <p style="margin: 0; font-size: 12px; color: #999999;">© 2025 ${env.GMAIL_FROM_NAME || 'LMS Platform'}. All rights reserved.</p>
            </td>
          </tr>
        </table>

        <!-- Disclaimer -->
        <table width="600" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td style="padding: 20px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #999999;">
                This email was sent automatically to verify your account. If you did not initiate this request, please disregard.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

// Send verification email function with beautiful template
export const sendVerificationEmail = async ({
  to,
  otp,
}: {
  to: string;
  otp: string;
}) => {
  try {
    const html = generateVerificationEmailHTML(otp);
    
    const info = await mailer.sendMail({
      from: env.GMAIL_FROM_NAME ? `${env.GMAIL_FROM_NAME} <${env.GMAIL_USER}>` : env.GMAIL_USER,
      to,
      subject: 'Verify your email address',
      html,
    });
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

// Generic send email function (for other email types)
export const sendEmail = async ({
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
