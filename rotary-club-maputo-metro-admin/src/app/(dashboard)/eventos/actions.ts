"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";

function eventPayload(formData: FormData) {
  const startTime = String(formData.get("start_time") ?? "").trim();
  const endTime = String(formData.get("end_time") ?? "").trim();
  const locationName = String(formData.get("location_name") ?? "").trim();
  const locationAddress = String(formData.get("location_address") ?? "").trim();

  return {
    event_date: String(formData.get("event_date") ?? ""),
    start_time: startTime || null,
    end_time: endTime || null,
    location_name: locationName || null,
    location_address: locationAddress || null,
    title_pt: String(formData.get("title_pt") ?? ""),
    title_en: String(formData.get("title_en") ?? ""),
    info_pt: String(formData.get("info_pt") ?? ""),
    info_en: String(formData.get("info_en") ?? ""),
    gallery: String(formData.get("gallery") ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    video_url: String(formData.get("video_url") ?? "").trim() || null,
  };
}

async function uniqueEventId(
  supabase: ReturnType<typeof createClient>,
  base: string
): Promise<string> {
  let id = base;
  let suffix = 2;
  while (true) {
    const { data } = await supabase
      .from("events")
      .select("id")
      .eq("id", id)
      .maybeSingle();
    if (!data) return id;
    id = `${base}-${suffix}`;
    suffix += 1;
  }
}

export async function createEvent(formData: FormData) {
  const supabase = createClient();
  const id = await uniqueEventId(
    supabase,
    slugify(String(formData.get("title_pt") ?? ""))
  );
  const published = formData.get("intent") === "publish";

  const { error } = await supabase
    .from("events")
    .insert({ id, ...eventPayload(formData), published, sort_order: 999 });

  if (error) throw new Error(`Criar evento: ${error.message}`);

  revalidatePath("/eventos");
  redirect("/eventos");
}

export async function updateEvent(id: string, formData: FormData) {
  const supabase = createClient();
  const published = formData.get("intent") === "publish";

  const { error } = await supabase
    .from("events")
    .update({ ...eventPayload(formData), published })
    .eq("id", id);

  if (error) throw new Error(`Guardar evento: ${error.message}`);

  revalidatePath("/eventos");
  redirect("/eventos");
}

export async function deleteEvent(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw new Error(`Apagar evento: ${error.message}`);
  revalidatePath("/eventos");
}
