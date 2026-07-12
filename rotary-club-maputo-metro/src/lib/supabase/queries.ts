import { createClient } from "./server";
import type {
  Project,
  ClubEvent,
  Leader,
  ClubInfo,
  HomeContent,
  AboutContent,
  ClubContactsData,
  GalleryItem,
  GallerySettingsData,
  NewsArticle,
} from "@/lib/data";

const SIGNED_URL_TTL = 3600;

function toProject(row: any): Project {
  return {
    id: row.id,
    title: { pt: row.title_pt, en: row.title_en },
    summary: { pt: row.summary_pt, en: row.summary_en },
    detail: { pt: row.detail_pt, en: row.detail_en },
    category: row.category,
    categoryLabel: {
      pt: row.project_categories?.label_pt ?? row.category,
      en: row.project_categories?.label_en ?? row.category,
    },
    status: row.status,
    image: row.image,
    gallery: row.gallery ?? undefined,
    videoUrl: row.video_url ?? undefined,
    featured: row.featured,
  };
}

export async function getProjects(): Promise<Project[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, project_categories(label_pt, label_en)")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`getProjects: ${error.message}`);
  return (data ?? []).map(toProject);
}

export async function getProject(id: string): Promise<Project | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, project_categories(label_pt, label_en)")
    .eq("id", id)
    .single();

  if (error) return null;
  return toProject(data);
}

const MONTHS_PT = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];
const MONTHS_EN = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export async function getEvents(): Promise<ClubEvent[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`getEvents: ${error.message}`);

  const today = new Date().toISOString().slice(0, 10);

  return (data ?? []).map((row) => {
    const [year, month, day] = row.event_date.split("-");
    const monthIndex = parseInt(month, 10) - 1;

    return {
      id: row.id,
      day,
      month: { pt: MONTHS_PT[monthIndex], en: MONTHS_EN[monthIndex] },
      year,
      title: { pt: row.title_pt, en: row.title_en },
      info: { pt: row.info_pt, en: row.info_en },
      status: row.event_date >= today ? "upcoming" : "past",
      gallery: row.gallery ?? undefined,
      videoUrl: row.video_url ?? undefined,
    };
  });
}

export async function getLeaders(): Promise<Leader[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("leaders")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`getLeaders: ${error.message}`);

  return (data ?? []).map((row) => ({
    name: row.name,
    role: { pt: row.role_pt, en: row.role_en },
  }));
}

export async function getClubContacts(): Promise<ClubContactsData> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("club_contacts")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) throw new Error(`getClubContacts: ${error.message}`);

  return {
    email: data.email,
    phone: data.phone,
    meetings: { pt: data.meetings_pt, en: data.meetings_en },
    social: {
      facebook: data.facebook,
      linkedin: data.linkedin,
      instagram: data.instagram,
    },
  };
}

export type SiteContent = {
  club: ClubInfo;
  home: HomeContent;
  about: AboutContent;
  heroImage: string;
  missionImage: string;
};

export async function getSiteContent(): Promise<SiteContent> {
  const supabase = createClient();

  const [{ data: content, error: contentError }, { data: values, error: valuesError }] =
    await Promise.all([
      supabase.from("site_content").select("*").eq("id", 1).single(),
      supabase
        .from("about_values")
        .select("*")
        .order("sort_order", { ascending: true }),
    ]);

  if (contentError) throw new Error(`getSiteContent: ${contentError.message}`);
  if (valuesError) throw new Error(`getSiteContent: ${valuesError.message}`);

  return {
    club: {
      name: content.club_name,
      district: { pt: content.club_district_pt, en: content.club_district_en },
      acronym: content.club_acronym,
      founded: content.club_founded,
    },
    home: {
      headline: { pt: content.home_headline_pt, en: content.home_headline_en },
      lead: { pt: content.home_lead_pt, en: content.home_lead_en },
      invite: { pt: content.home_invite_pt, en: content.home_invite_en },
    },
    about: {
      mission: { pt: content.about_mission_pt, en: content.about_mission_en },
      riVision: {
        pt: content.about_ri_vision_pt,
        en: content.about_ri_vision_en,
      },
      riMission: {
        pt: content.about_ri_mission_pt,
        en: content.about_ri_mission_en,
      },
      values: (values ?? []).map((v) => ({
        title: { pt: v.title_pt, en: v.title_en },
        text: { pt: v.text_pt, en: v.text_en },
      })),
    },
    heroImage: content.hero_image,
    missionImage: content.mission_image,
  };
}

export async function getGalleryItems(scope: {
  projectId?: string;
  eventId?: string;
  newsId?: string;
}): Promise<GalleryItem[]> {
  const supabase = createClient();
  let query = supabase
    .from("gallery_items")
    .select("*")
    .order("sort_order", { ascending: true });

  query = scope.projectId
    ? query.eq("project_id", scope.projectId)
    : scope.eventId
      ? query.eq("event_id", scope.eventId)
      : query.eq("news_id", scope.newsId!);

  const { data, error } = await query;
  if (error) throw new Error(`getGalleryItems: ${error.message}`);
  if (!data || data.length === 0) return [];

  const paths = data.map((row) => row.storage_path);
  const { data: signed, error: signError } = await supabase.storage
    .from("gallery")
    .createSignedUrls(paths, SIGNED_URL_TTL);
  if (signError) throw new Error(`getGalleryItems (signed urls): ${signError.message}`);

  const urlByPath = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));

  return data.map((row) => ({
    id: row.id,
    url: urlByPath.get(row.storage_path) ?? "",
    mediaType: row.media_type,
    caption: { pt: row.caption_pt ?? "", en: row.caption_en ?? "" },
    tag: row.tag ?? undefined,
    width: row.width ?? undefined,
    height: row.height ?? undefined,
  }));
}

export async function getGallerySettings(): Promise<GallerySettingsData> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("gallery_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) throw new Error(`getGallerySettings: ${error.message}`);
  return { style: data.style, fullscreen: data.fullscreen };
}

export async function getNewsList(): Promise<NewsArticle[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) throw new Error(`getNewsList: ${error.message}`);
  if (!data || data.length === 0) return [];

  const { data: covers, error: coverError } = await supabase
    .from("gallery_items")
    .select("*")
    .in("news_id", data.map((row) => row.id))
    .eq("status", "approved")
    .order("is_cover", { ascending: false })
    .order("sort_order", { ascending: true });
  if (coverError) throw new Error(`getNewsList (covers): ${coverError.message}`);

  const coverByNewsId = new Map<string, (typeof covers)[number]>();
  for (const item of covers ?? []) {
    if (!coverByNewsId.has(item.news_id)) coverByNewsId.set(item.news_id, item);
  }

  const coverPaths = Array.from(coverByNewsId.values()).map((c) => c.storage_path);
  const { data: signed } =
    coverPaths.length > 0
      ? await supabase.storage.from("gallery").createSignedUrls(coverPaths, SIGNED_URL_TTL)
      : { data: [] as { path: string; signedUrl: string }[] };
  const urlByPath = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));

  return data.map((row) => {
    const cover = coverByNewsId.get(row.id);
    return {
      id: row.id,
      title: { pt: row.title_pt, en: row.title_en },
      excerpt: { pt: row.excerpt_pt, en: row.excerpt_en },
      body: { pt: row.body_pt, en: row.body_en },
      author: row.author ?? "",
      publishedAt: row.published_at,
      coverImage: cover
        ? {
            id: cover.id,
            url: urlByPath.get(cover.storage_path) ?? "",
            mediaType: cover.media_type,
            caption: { pt: cover.caption_pt ?? "", en: cover.caption_en ?? "" },
          }
        : undefined,
    };
  });
}

export async function getNewsArticle(id: string): Promise<NewsArticle | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;

  return {
    id: data.id,
    title: { pt: data.title_pt, en: data.title_en },
    excerpt: { pt: data.excerpt_pt, en: data.excerpt_en },
    body: { pt: data.body_pt, en: data.body_en },
    author: data.author ?? "",
    publishedAt: data.published_at,
  };
}
