"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { GallerySettings } from "@/lib/types";

export async function updateGallerySettings(settings: GallerySettings) {
  const supabase = createClient();
  const { error } = await supabase
    .from("gallery_settings")
    .update({ style: settings.style, fullscreen: settings.fullscreen })
    .eq("id", 1);

  if (error) throw new Error(`Guardar estilo da galeria: ${error.message}`);

  revalidatePath("/galeria/definicoes");
}
