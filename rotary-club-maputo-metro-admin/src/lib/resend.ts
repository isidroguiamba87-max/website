import { Resend } from "resend";

const FROM = process.env.RESEND_FROM_EMAIL || "Rotary Club Maputo Metro <onboarding@resend.dev>";

export async function sendReplyEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY não está configurada." };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject,
    text: body,
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
