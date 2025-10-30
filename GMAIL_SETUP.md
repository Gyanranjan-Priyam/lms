# Gmail SMTP Setup for Email Verification

This application now uses Gmail SMTP via Nodemailer instead of Resend for sending verification emails. Follow these steps to set up Gmail SMTP:

## Prerequisites

1. A Gmail account
2. 2-Factor Authentication enabled on your Gmail account

## Setup Steps

### 1. Enable 2-Factor Authentication

1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Navigate to "Security"
3. Enable "2-Step Verification" if not already enabled

### 2. Generate App Password

1. In your Google Account security settings, find "App passwords"
2. Select "Mail" as the app
3. Select "Other (custom name)" as the device
4. Enter a name like "LMS Application"
5. Click "Generate"
6. Copy the 16-character app password (it will look like: `abcd efgh ijkl mnop`)

### 3. Configure Environment Variables

Add these variables to your `.env` file:

```env
# Gmail SMTP Configuration
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="abcdefghijklmnop"  # The 16-character app password (no spaces)
GMAIL_FROM_NAME="Your LMS Application"  # Optional: Name that appears in emails
```

### 4. Important Notes

- **Never use your regular Gmail password** - always use the app password
- The app password should be 16 characters without spaces
- `GMAIL_FROM_NAME` is optional - if not provided, just the email address will be used
- Make sure your `.env` file is in your `.gitignore` to keep credentials secure

### 5. Testing

Once configured, verification emails will be sent from your Gmail account when users:
- Sign up with email
- Request email verification
- Use the email OTP feature

The emails will appear to come from your Gmail address with the specified display name.

## Troubleshooting

- **Authentication failed**: Check that you're using the app password, not your regular password
- **Less secure apps**: Gmail SMTP with app passwords doesn't require enabling "less secure apps"
- **Rate limits**: Gmail has sending limits - for production, consider using a dedicated email service
- **Spam folder**: Initial emails might go to spam until your domain builds reputation

## Production Considerations

For production environments, consider:
- Using a dedicated email service (SendGrid, Mailgun, etc.) for higher reliability
- Setting up SPF, DKIM, and DMARC records for better deliverability
- Using a custom domain for sending emails
- Implementing proper error handling and retry logic