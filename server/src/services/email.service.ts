import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailParams {
  to: string;
  subject: string;
  text?: string;
  html: string;
}

export interface SendActivationEmailParams {
  to: string;
  activationLink: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    to,
    subject,
    html,
  });

  if (error) {
    console.error("Resend error:", error);
    throw error;
  }
}

export async function sendActivationEmail({
  to,
  activationLink,
}: SendActivationEmailParams) {
  const subject = "Confirm your account";

  const html = `
    <h2>Confirm your account</h2>
    <p>Click the link below to activate your account:</p>
    <a href="${activationLink}">Activate account</a>
  `;

  await sendEmail({
    to,
    subject,
    html,
  });
}
