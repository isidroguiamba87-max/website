import { NextResponse } from "next/server";
import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const MAX_IMAGE_DIMENSION = 1600;

const IMAGE_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const folder = String(formData.get("folder") ?? "general").replace(/[^a-z0-9-]/gi, "");

  if (!file) {
    return NextResponse.json({ error: "Nenhum ficheiro enviado." }, { status: 400 });
  }
  if (!(file.type in IMAGE_EXT)) {
    return NextResponse.json(
      { error: `Tipo de ficheiro não suportado: ${file.type}` },
      { status: 400 }
    );
  }

  try {
    const buffer = await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate()
      .resize({
        width: MAX_IMAGE_DIMENSION,
        height: MAX_IMAGE_DIMENSION,
        fit: "inside",
        withoutEnlargement: true,
      })
      .toBuffer();

    const path = `${folder || "general"}/${crypto.randomUUID()}.${IMAGE_EXT[file.type]}`;
    const { error } = await supabase.storage
      .from("covers")
      .upload(path, buffer, { contentType: file.type, upsert: false });
    if (error) throw new Error(error.message);

    const {
      data: { publicUrl },
    } = supabase.storage.from("covers").getPublicUrl(path);

    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro desconhecido." },
      { status: 500 }
    );
  }
}
