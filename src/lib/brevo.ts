import * as brevo from "@getbrevo/brevo";

const apiKey = process.env.BREVO_API_KEY;
const client = new brevo.TransactionalEmailsApi();

if (apiKey) {
  client.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);
}

export async function sendEmail(to: string, toName: string, subject: string, html: string) {
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  if (!apiKey || !senderEmail) {
    // No mail config in this environment — log instead of throwing so the
    // intake flow keeps working in local/dev.
    console.warn("[brevo] BREVO_API_KEY/SENDER ontbreekt — e-mail niet verzonden:", subject);
    return;
  }

  const email = new brevo.SendSmtpEmail();
  email.sender = {
    name: process.env.BREVO_SENDER_NAME ?? "Digital Twin Advies",
    email: senderEmail,
  };
  email.to = [{ email: to, name: toName }];
  email.subject = subject;
  email.htmlContent = html;
  return client.sendTransacEmail(email);
}
