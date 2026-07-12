"use server";

import sharp from "sharp";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const CONTENT_TYPE_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

function contentTypeForPath(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  return CONTENT_TYPE_BY_EXT[ext] ?? "application/octet-stream";
}

async function downloadBuffer(
  supabase: ReturnType<typeof createClient>,
  path: string
): Promise<Buffer> {
  const { data, error } = await supabase.storage.from("gallery").download(path);
  if (error) throw new Error(`Descarregar imagem: ${error.message}`);
  return Buffer.from(await data.arrayBuffer());
}

export async function rotatePhoto(id: string, path: string) {
  const supabase = createClient();
  const input = await downloadBuffer(supabase, path);
  const { data, info } = await sharp(input)
    .rotate(90)
    .toBuffer({ resolveWithObject: true });

  const { error: uploadError } = await supabase.storage
    .from("gallery")
    .upload(path, data, { upsert: true, contentType: contentTypeForPath(path) });
  if (uploadError) throw new Error(`Rodar foto: ${uploadError.message}`);

  const { error } = await supabase
    .from("gallery_items")
    .update({ width: info.width, height: info.height })
    .eq("id", id);
  if (error) throw new Error(`Rodar foto: ${error.message}`);

  revalidatePath("/galeria");
}

export async function cropPhoto(
  id: string,
  path: string,
  rect: { left: number; top: number; width: number; height: number }
) {
  const supabase = createClient();
  const input = await downloadBuffer(supabase, path);
  const { data, info } = await sharp(input)
    .extract({
      left: Math.round(rect.left),
      top: Math.round(rect.top),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    })
    .toBuffer({ resolveWithObject: true });

  const { error: uploadError } = await supabase.storage
    .from("gallery")
    .upload(path, data, { upsert: true, contentType: contentTypeForPath(path) });
  if (uploadError) throw new Error(`Recortar foto: ${uploadError.message}`);

  const { error } = await supabase
    .from("gallery_items")
    .update({ width: info.width, height: info.height })
    .eq("id", id);
  if (error) throw new Error(`Recortar foto: ${error.message}`);

  revalidatePath("/galeria");
}

export async function setCover(
  id: string,
  projectId: string | null,
  eventId: string | null,
  newsId: string | null
) {
  const supabase = createClient();

  let clearQuery = supabase.from("gallery_items").update({ is_cover: false });
  clearQuery = projectId
    ? clearQuery.eq("project_id", projectId)
    : eventId
      ? clearQuery.eq("event_id", eventId)
      : newsId
        ? clearQuery.eq("news_id", newsId)
        : clearQuery.is("project_id", null).is("event_id", null).is("news_id", null);
  const { error: clearError } = await clearQuery;
  if (clearError) throw new Error(`Definir capa: ${clearError.message}`);

  const { error } = await supabase
    .from("gallery_items")
    .update({ is_cover: true })
    .eq("id", id);
  if (error) throw new Error(`Definir capa: ${error.message}`);

  revalidatePath("/galeria");
}

export async function reorderItems(orderedIds: string[]) {
  const supabase = createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("gallery_items").update({ sort_order: index }).eq("id", id)
    )
  );
  revalidatePath("/galeria");
}

export async function setStatus(
  id: string,
  status: "pending" | "approved" | "rejected"
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("gallery_items")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(`Mudar estado: ${error.message}`);
  revalidatePath("/galeria");
}

export async function updateCaption(
  id: string,
  captionPt: string,
  captionEn: string,
  tag: string
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("gallery_items")
    .update({ caption_pt: captionPt, caption_en: captionEn, tag: tag || null })
    .eq("id", id);
  if (error) throw new Error(`Guardar legenda: ${error.message}`);
  revalidatePath("/galeria");
}

export async function deleteItem(id: string, path: string) {
  const supabase = createClient();
  const { error: storageError } = await supabase.storage
    .from("gallery")
    .remove([path]);
  if (storageError) throw new Error(`Apagar ficheiro: ${storageError.message}`);

  const { error } = await supabase.from("gallery_items").delete().eq("id", id);
  if (error) throw new Error(`Apagar item: ${error.message}`);

  revalidatePath("/galeria");
}
