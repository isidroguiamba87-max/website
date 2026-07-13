import { createClient } from "./supabase/server";
import type {
  ProjectCategory,
  AdminProject,
  AdminEvent,
  AdminNews,
  GalleryItem,
  GallerySettings,
  Submission,
} from "./types";

const SIGNED_URL_TTL = 3600;

export async function getCategories(): Promise<ProjectCategory[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("project_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`getCategories: ${error.message}`);

  return (data ?? []).map((row) => ({
    slug: row.slug,
    labelPt: row.label_pt,
    labelEn: row.label_en,
    sortOrder: row.sort_order,
  }));
}

function toAdminProject(row: any): AdminProject {
  return {
    id: row.id,
    titlePt: row.title_pt,
    titleEn: row.title_en,
    summaryPt: row.summary_pt,
    summaryEn: row.summary_en,
    detailPt: row.detail_pt,
    detailEn: row.detail_en,
    category: row.category,
    status: row.status,
    image: row.image,
    gallery: row.gallery ?? [],
    videoUrl: row.video_url ?? "",
    published: row.published,
    featured: row.featured,
    sortOrder: row.sort_order,
  };
}

export async function getProjects(): Promise<AdminProject[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`getProjects: ${error.message}`);
  return (data ?? []).map(toAdminProject);
}

export async function getProject(id: string): Promise<AdminProject | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`getProject: ${error.message}`);
  return data ? toAdminProject(data) : null;
}

function toAdminEvent(row: any): AdminEvent {
  return {
    id: row.id,
    eventDate: row.event_date ?? "",
    startTime: row.start_time ?? "",
    endTime: row.end_time ?? "",
    locationName: row.location_name ?? "",
    locationAddress: row.location_address ?? "",
    titlePt: row.title_pt,
    titleEn: row.title_en,
    infoPt: row.info_pt,
    infoEn: row.info_en,
    gallery: row.gallery ?? [],
    videoUrl: row.video_url ?? "",
    published: row.published,
    sortOrder: row.sort_order,
  };
}

export async function getEvents(): Promise<AdminEvent[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: false });

  if (error) throw new Error(`getEvents: ${error.message}`);
  return (data ?? []).map(toAdminEvent);
}

export async function getEvent(id: string): Promise<AdminEvent | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`getEvent: ${error.message}`);
  return data ? toAdminEvent(data) : null;
}

function toAdminNews(row: any): AdminNews {
  return {
    id: row.id,
    titlePt: row.title_pt,
    titleEn: row.title_en,
    excerptPt: row.excerpt_pt,
    excerptEn: row.excerpt_en,
    bodyPt: row.body_pt,
    bodyEn: row.body_en,
    author: row.author ?? "",
    publishedAt: row.published_at,
    published: row.published,
    sortOrder: row.sort_order,
  };
}

export async function getNewsList(): Promise<AdminNews[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) throw new Error(`getNewsList: ${error.message}`);
  return (data ?? []).map(toAdminNews);
}

export async function getNewsArticle(id: string): Promise<AdminNews | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`getNewsArticle: ${error.message}`);
  return data ? toAdminNews(data) : null;
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .order("project_id", { ascending: true, nullsFirst: true })
    .order("event_id", { ascending: true, nullsFirst: true })
    .order("news_id", { ascending: true, nullsFirst: true })
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`getGalleryItems: ${error.message}`);
  if (!data || data.length === 0) return [];

  const paths = data.map((row) => row.storage_path);
  const { data: signed, error: signError } = await supabase.storage
    .from("gallery")
    .createSignedUrls(paths, SIGNED_URL_TTL);

  if (signError) throw new Error(`getGalleryItems (signed urls): ${signError.message}`);

  const urlByPath = new Map(
    (signed ?? []).map((s) => [s.path, s.signedUrl])
  );

  return data.map((row) => ({
    id: row.id,
    storagePath: row.storage_path,
    url: urlByPath.get(row.storage_path) ?? "",
    mediaType: row.media_type,
    projectId: row.project_id,
    eventId: row.event_id,
    newsId: row.news_id,
    captionPt: row.caption_pt ?? "",
    captionEn: row.caption_en ?? "",
    tag: row.tag ?? "",
    status: row.status,
    isCover: row.is_cover,
    sortOrder: row.sort_order,
    width: row.width,
    height: row.height,
  }));
}

export async function getGallerySettings(): Promise<GallerySettings> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("gallery_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) throw new Error(`getGallerySettings: ${error.message}`);
  return { style: data.style, fullscreen: data.fullscreen };
}

export async function getDashboardCounts() {
  const supabase = createClient();
  const [projects, events, submissions] = await Promise.all([
    supabase.from("projects").select("published"),
    supabase.from("events").select("published"),
    supabase.from("submissions").select("status"),
  ]);

  if (projects.error) throw new Error(`getDashboardCounts: ${projects.error.message}`);
  if (events.error) throw new Error(`getDashboardCounts: ${events.error.message}`);
  // Não rebenta se a migração da tabela `submissions` ainda não tiver corrido.
  const submissionsUnread = submissions.error
    ? 0
    : (submissions.data ?? []).filter((r) => r.status === "unread").length;

  return {
    projectsPublished: (projects.data ?? []).filter((r) => r.published).length,
    projectsDraft: (projects.data ?? []).filter((r) => !r.published).length,
    eventsPublished: (events.data ?? []).filter((r) => r.published).length,
    eventsDraft: (events.data ?? []).filter((r) => !r.published).length,
    submissionsUnread,
  };
}

function toSubmission(row: any): Submission {
  return {
    id: row.id,
    source: row.source,
    name: row.name,
    email: row.email,
    message: row.message,
    meta: row.meta,
    status: row.status,
    replyBody: row.reply_body,
    repliedAt: row.replied_at,
    createdAt: row.created_at,
  };
}

export async function getSubmissions(): Promise<Submission[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`getSubmissions: ${error.message}`);
  return (data ?? []).map(toSubmission);
}

export async function getSubmission(id: string): Promise<Submission | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`getSubmission: ${error.message}`);
  return data ? toSubmission(data) : null;
}
