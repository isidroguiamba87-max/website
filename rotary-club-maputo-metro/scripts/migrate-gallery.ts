import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
import { join, extname, basename } from "path";

config({ path: ".env.local" });
import { projects, events } from "../src/lib/data";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Falta NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY em .env.local"
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey);
const PUBLIC_DIR = join(__dirname, "..", "public");
const IMAGE_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

async function uploadAndInsert(
  localPath: string,
  storagePath: string,
  projectId: string | null,
  eventId: string | null,
  sortOrder: number,
  status: "approved" | "pending"
) {
  const ext = extname(localPath).toLowerCase();
  const mime = IMAGE_MIME[ext];
  if (!mime) {
    console.warn(`  a saltar (extensão não suportada): ${localPath}`);
    return;
  }

  const buffer = readFileSync(join(PUBLIC_DIR, localPath));
  const { error: uploadError } = await supabase.storage
    .from("gallery")
    .upload(storagePath, buffer, { contentType: mime, upsert: true });
  if (uploadError) throw new Error(`upload ${localPath}: ${uploadError.message}`);

  const { error } = await supabase.from("gallery_items").upsert(
    {
      storage_path: storagePath,
      media_type: "image",
      project_id: projectId,
      event_id: eventId,
      status,
      sort_order: sortOrder,
    },
    { onConflict: "storage_path" }
  );
  if (error) throw new Error(`gallery_items ${storagePath}: ${error.message}`);
}

async function migrateProjects() {
  let count = 0;
  for (const p of projects) {
    if (!p.gallery) continue;
    for (let index = 0; index < p.gallery.length; index++) {
      const localPath = p.gallery[index];
      const storagePath = `${p.id}/${basename(localPath)}`;
      await uploadAndInsert(localPath, storagePath, p.id, null, index, "approved");
      count++;
    }
  }
  console.log(`projects: ${count} fotos migradas (aprovadas)`);
}

async function migrateEvents() {
  let count = 0;
  for (const e of events) {
    if (!e.gallery) continue;
    for (let index = 0; index < e.gallery.length; index++) {
      const localPath = e.gallery[index];
      const storagePath = `${e.id}/${basename(localPath)}`;
      await uploadAndInsert(localPath, storagePath, null, e.id, index, "approved");
      count++;
    }
  }
  console.log(`events: ${count} fotos migradas (aprovadas)`);
}

async function migrateGeneralGallery() {
  const dir = join(PUBLIC_DIR, "images", "gallery");
  const files = readdirSync(dir).filter((f) => IMAGE_MIME[extname(f).toLowerCase()]);

  let count = 0;
  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    const localPath = `/images/gallery/${file}`;
    const storagePath = `general/${file}`;
    await uploadAndInsert(localPath, storagePath, null, null, index, "pending");
    count++;
  }
  console.log(`galeria geral: ${count} fotos migradas (pendentes de aprovação)`);
}

async function main() {
  await migrateProjects();
  await migrateEvents();
  await migrateGeneralGallery();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
