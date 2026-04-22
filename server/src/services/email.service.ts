import nodemailer from 'nodemailer';
import 'dotenv/config';

export interface SendEmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface SendActivationEmailParams {
  to: string;
  activationLink: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({ to, subject, text, html }: SendEmailParams) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@example.com',
    to,
    subject,
    text,
    html,
  });
}

export async function sendActivationEmail({ to, activationLink }: SendActivationEmailParams) {
  const subject = 'Confirm your account';
  const text = `Please confirm your email by visiting: ${activationLink}`;
  const html = `<p>Please confirm your email by clicking the link below:</p><p><a href="${activationLink}">Activate account</a></p>`;

  await sendEmail({
    to,
    subject,
    text,
    html,
  });
}
