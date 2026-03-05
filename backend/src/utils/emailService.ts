import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends OTP email to user for password reset
 * @param email User's email address
 * @param otp 6-digit OTP code
 */
export const sendPasswordResetOTP = async (email: string, otp: string): Promise<void> => {
  const mailOptions = {
    from: `"GoTrek" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset OTP - GoTrek',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%);
            padding: 30px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            padding: 40px 30px;
          }
          .otp-box {
            background-color: #f0f9ff;
            border: 2px dashed #3b82f6;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
          }
          .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #1e40af;
            letter-spacing: 8px;
            margin: 10px 0;
          }
          .warning {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #3b82f6;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏔️ GoTrek Password Reset</h1>
          </div>
          <div class="content">
            <h2 style="color: #1f2937;">Hello Trekker!</h2>
            <p style="color: #4b5563; line-height: 1.6;">
              We received a request to reset your password for your GoTrek account.
              Use the OTP code below to proceed with resetting your password.
            </p>

            <div class="otp-box">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">Your OTP Code</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 0; color: #6b7280; font-size: 12px;">Valid for 10 minutes</p>
            </div>

            <p style="color: #4b5563; line-height: 1.6;">
              Enter this code on the password reset page to create a new password.
            </p>

            <div class="warning">
              <strong>⚠️ Security Notice:</strong><br>
              If you didn't request this password reset, please ignore this email or contact support if you have concerns about your account security.
            </div>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              <strong>Tips for a secure password:</strong><br>
              • Use at least 8 characters<br>
              • Include uppercase and lowercase letters<br>
              • Add numbers and special characters<br>
              • Avoid common words or personal information
            </p>
          </div>
          <div class="footer">
            <p>This is an automated message from GoTrek - Your Trekking Companion</p>
            <p>© 2025 GoTrek. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      GoTrek - Password Reset OTP

      Hello Trekker!

      We received a request to reset your password for your GoTrek account.

      Your OTP Code: ${otp}

      This code is valid for 10 minutes.

      If you didn't request this password reset, please ignore this email.

      © 2025 GoTrek. All rights reserved.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset OTP sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send password reset email');
  }
};

/**
 * Sends welcome email to new users
 * @param email User's email address
 * @param name User's name
 */
export const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
  const mailOptions = {
    from: `"GoTrek" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to GoTrek! 🏔️',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%); padding: 30px; text-align: center; color: white; }
          .content { padding: 40px 30px; }
          .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏔️ Welcome to GoTrek!</h1>
          </div>
          <div class="content">
            <h2 style="color: #1f2937;">Hello ${name}!</h2>
            <p style="color: #4b5563; line-height: 1.6;">
              Welcome to GoTrek - your ultimate trekking companion! We're excited to have you join our community of adventure enthusiasts.
            </p>
            <p style="color: #4b5563; line-height: 1.6;">
              Start exploring Nepal's most beautiful trekking trails, join groups, and track your adventures today!
            </p>
          </div>
          <div class="footer">
            <p>© 2025 GoTrek. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};
// TODO: add email template versioning
