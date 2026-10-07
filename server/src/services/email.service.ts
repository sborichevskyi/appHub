import axios from "axios";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

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
  const senderEmail = process.env.EMAIL_FROM;

  if (!process.env.BREVO_API_KEY || !senderEmail) {
    throw new Error("BREVO_API_KEY and EMAIL_FROM must be set");
  }

  try {
    await axios.post(
      BREVO_API_URL,
      {
        sender: { name: process.env.EMAIL_FROM_NAME || "AppHub", email: senderEmail },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      { headers: { "api-key": process.env.BREVO_API_KEY } },
    );
  } catch (err) {
    // Rethrow a plain error: AxiosError carries request headers (incl. the API key)
    const details = axios.isAxiosError(err) ? err.response?.data ?? err.message : err;
    console.error("Brevo error:", details);
    throw new Error("Failed to send email");
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
