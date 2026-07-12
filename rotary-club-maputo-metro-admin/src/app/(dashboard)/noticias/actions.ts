"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";

function newsPayload(formData: FormData) {
  return {
    title_pt: String(formData.get("title_pt") ?? ""),
    title_en: String(formData.get("title_en") ?? ""),
    excerpt_pt: String(formData.get("excerpt_pt") ?? ""),
    excerpt_en: String(formData.get("excerpt_en") ?? ""),
    body_pt: String(formData.get("body_pt") ?? ""),
    body_en: String(formData.get("body_en") ?? ""),
    author: String(formData.get("author") ?? "").trim() || null,
    published_at: String(formData.get("published_at") ?? new Date().toISOString().slice(0, 10)),
  };
}

async function uniqueNewsId(
  supabase: ReturnType<typeof createClient>,
  base: string
): Promise<string> {
  let id = base;
  let suffix = 2;
  while (true) {
    const { data } = await supabase.from("news").select("id").eq("id", id).maybeSingle();
    if (!data) return id;
    id = `${base}-${suffix}`;
    suffix += 1;
  }
}

export async function createNews(formData: FormData) {
  const supabase = createClient();
  const id = await uniqueNewsId(supabase, slugify(String(formData.get("title_pt") ?? "")));
  const published = formData.get("intent") === "publish";

  const { error } = await supabase
    .from("news")
    .insert({ id, ...newsPayload(formData), published, sort_order: 999 });
  if (error) throw new Error(`Criar notícia: ${error.message}`);

  revalidatePath("/noticias");
  redirect("/noticias");
}

export async function updateNews(id: string, formData: FormData) {
  const supabase = createClient();
  const published = formData.get("intent") === "publish";

  const { error } = await supabase
    .from("news")
    .update({ ...newsPayload(formData), published })
    .eq("id", id);
  if (error) throw new Error(`Guardar notícia: ${error.message}`);

  revalidatePath("/noticias");
  redirect("/noticias");
}

export async function deleteNews(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("news").delete().eq("id", id);
  if (error) throw new Error(`Apagar notícia: ${error.message}`);
  revalidatePath("/noticias");
}
