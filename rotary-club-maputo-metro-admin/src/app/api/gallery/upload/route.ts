import { NextResponse } from "next/server";
import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const MAX_IMAGE_DIMENSION = 1600;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

const IMAGE_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const VIDEO_EXT: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
};

async function nextSortOrder(
  supabase: ReturnType<typeof createClient>,
  projectId: string | null,
  eventId: string | null,
  newsId: string | null
): Promise<number> {
  let query = supabase
    .from("gallery_items")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);

  query = projectId
    ? query.eq("project_id", projectId)
    : eventId
      ? query.eq("event_id", eventId)
      : newsId
        ? query.eq("news_id", newsId)
        : query.is("project_id", null).is("event_id", null).is("news_id", null);

  const { data } = await query;
  return (data?.[0]?.sort_order ?? -1) + 1;
}

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData.getAll("files") as File[];
  const projectId = (formData.get("project_id") as string) || null;
  const eventId = (formData.get("event_id") as string) || null;
  const newsId = (formData.get("news_id") as string) || null;

  if (files.length === 0) {
    return NextResponse.json({ error: "Nenhum ficheiro enviado." }, { status: 400 });
  }

  let sortOrder = await nextSortOrder(supabase, projectId, eventId, newsId);
  const results: { file: string; error?: string }[] = [];

  for (const file of files) {
    try {
      const isImage = file.type in IMAGE_EXT;
      const isVideo = file.type in VIDEO_EXT;

      if (!isImage && !isVideo) {
        throw new Error(`Tipo de ficheiro não suportado: ${file.type}`);
      }
      if (isVideo && file.size > MAX_VIDEO_BYTES) {
        throw new Error("Vídeo maior do que o limite de 100MB.");
      }

      const inputBuffer = Buffer.from(await file.arrayBuffer());
      let buffer = inputBuffer;
      let width: number | null = null;
      let height: number | null = null;

      if (isImage) {
        const { data, info } = await sharp(inputBuffer)
          .rotate()
          .resize({
            width: MAX_IMAGE_DIMENSION,
            height: MAX_IMAGE_DIMENSION,
            fit: "inside",
            withoutEnlargement: true,
          })
          .toBuffer({ resolveWithObject: true });
        buffer = data;
        width = info.width;
        height = info.height;
      }

      const ext = isImage ? IMAGE_EXT[file.type] : VIDEO_EXT[file.type];
      const folder = projectId ?? eventId ?? newsId ?? "general";
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(path, buffer, { contentType: file.type, upsert: false });
      if (uploadError) throw new Error(uploadError.message);

      const { error: insertError } = await supabase.from("gallery_items").insert({
        storage_path: path,
        media_type: isImage ? "image" : "video",
        project_id: projectId,
        event_id: eventId,
        news_id: newsId,
        status: "pending",
        sort_order: sortOrder,
        width,
        height,
      });
      if (insertError) throw new Error(insertError.message);

      sortOrder += 1;
      results.push({ file: file.name });
    } catch (err) {
      results.push({
        file: file.name,
        error: err instanceof Error ? err.message : "Erro desconhecido.",
      });
    }
  }

  return NextResponse.json({ results });
}
