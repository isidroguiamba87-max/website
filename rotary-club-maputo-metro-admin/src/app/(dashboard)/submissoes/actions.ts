"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendReplyEmail } from "@/lib/resend";

export async function markAsRead(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("submissions")
    .update({ status: "read" })
    .eq("id", id)
    .eq("status", "unread");

  if (error) throw new Error(`markAsRead: ${error.message}`);
  revalidatePath("/submissoes");
}

export async function replyToSubmission(
  id: string,
  _prevState: { ok: boolean; error?: string },
  formData: FormData
): Promise<{ ok: boolean; error?: string }> {
  const supabase = createClient();
  const replyBody = String(formData.get("reply") ?? "").trim();
  const to = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "Resposta do Rotary Club of Maputo Metro");

  if (!replyBody) {
    return { ok: false, error: "Escreva uma resposta antes de enviar." };
  }

  const result = await sendReplyEmail({ to, subject, body: replyBody });

  const { error } = await supabase
    .from("submissions")
    .update({
      status: "replied",
      reply_body: replyBody,
      replied_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(`replyToSubmission: ${error.message}`);

  revalidatePath("/submissoes");
  revalidatePath(`/submissoes/${id}`);

  if (!result.ok) {
    return {
      ok: false,
      error: `Resposta guardada, mas o envio do email falhou: ${result.error}`,
    };
  }
  return { ok: true };
}

export async function deleteSubmission(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("submissions").delete().eq("id", id);
  if (error) throw new Error(`deleteSubmission: ${error.message}`);
  revalidatePath("/submissoes");
}
