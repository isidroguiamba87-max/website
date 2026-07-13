"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function generatePassword(): string {
  return randomBytes(9).toString("base64").replace(/[/+=]/g, "x");
}

export type CreateUserState =
  | { ok: false; error?: string }
  | { ok: true; email: string; password: string };

export async function createAdminUser(
  _prevState: CreateUserState,
  formData: FormData
): Promise<CreateUserState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Escreva um email válido." };
  }

  const admin = createAdminClient();
  const password = generatePassword();

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/utilizadores");
  return { ok: true, email: data.user.email!, password };
}

export async function deleteAdminUser(id: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.id === id) {
    throw new Error("Não podes remover a tua própria conta.");
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) throw new Error(`deleteAdminUser: ${error.message}`);

  revalidatePath("/utilizadores");
}
