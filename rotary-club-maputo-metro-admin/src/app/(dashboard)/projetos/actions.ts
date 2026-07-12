"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";

const NEW_CATEGORY_VALUE = "__new__";

async function resolveCategory(
  supabase: ReturnType<typeof createClient>,
  formData: FormData
): Promise<string> {
  const category = String(formData.get("category") ?? "");
  if (category !== NEW_CATEGORY_VALUE) return category;

  const labelPt = String(formData.get("new_category_label_pt") ?? "").trim();
  const labelEn = String(formData.get("new_category_label_en") ?? "").trim();
  if (!labelPt || !labelEn) {
    throw new Error("Preencha o nome da nova categoria em PT e EN.");
  }
  const slug = slugify(labelPt);

  const { data: existing } = await supabase
    .from("project_categories")
    .select("slug")
    .eq("slug", slug)
    .maybeSingle();
  if (existing) return existing.slug;

  const { error } = await supabase
    .from("project_categories")
    .insert({ slug, label_pt: labelPt, label_en: labelEn, sort_order: 999 });
  if (error) throw new Error(`Categoria: ${error.message}`);

  return slug;
}

function projectPayload(formData: FormData, category: string) {
  return {
    title_pt: String(formData.get("title_pt") ?? ""),
    title_en: String(formData.get("title_en") ?? ""),
    summary_pt: String(formData.get("summary_pt") ?? ""),
    summary_en: String(formData.get("summary_en") ?? ""),
    detail_pt: String(formData.get("detail_pt") ?? ""),
    detail_en: String(formData.get("detail_en") ?? ""),
    category,
    status: String(formData.get("status") ?? "active"),
    image: String(formData.get("image") ?? ""),
    gallery: String(formData.get("gallery") ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    video_url: String(formData.get("video_url") ?? "").trim() || null,
    featured: formData.get("featured") === "on",
  };
}

async function uniqueProjectId(
  supabase: ReturnType<typeof createClient>,
  base: string
): Promise<string> {
  let id = base;
  let suffix = 2;
  while (true) {
    const { data } = await supabase
      .from("projects")
      .select("id")
      .eq("id", id)
      .maybeSingle();
    if (!data) return id;
    id = `${base}-${suffix}`;
    suffix += 1;
  }
}

export async function createProject(formData: FormData) {
  const supabase = createClient();
  const category = await resolveCategory(supabase, formData);
  const id = await uniqueProjectId(
    supabase,
    slugify(String(formData.get("title_pt") ?? ""))
  );
  const published = formData.get("intent") === "publish";

  const { error } = await supabase
    .from("projects")
    .insert({ id, ...projectPayload(formData, category), published, sort_order: 999 });

  if (error) throw new Error(`Criar projeto: ${error.message}`);

  revalidatePath("/projetos");
  redirect("/projetos");
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = createClient();
  const category = await resolveCategory(supabase, formData);
  const published = formData.get("intent") === "publish";

  const { error } = await supabase
    .from("projects")
    .update({ ...projectPayload(formData, category), published })
    .eq("id", id);

  if (error) throw new Error(`Guardar projeto: ${error.message}`);

  revalidatePath("/projetos");
  redirect("/projetos");
}

export async function deleteProject(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(`Apagar projeto: ${error.message}`);
  revalidatePath("/projetos");
}
