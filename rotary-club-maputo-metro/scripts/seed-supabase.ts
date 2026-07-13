import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });
import {
  projects,
  events,
  leaders,
  about,
  home,
  club,
  clubContacts,
  heroImage,
  missionImage,
} from "../src/lib/data";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Falta NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY em .env.local"
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function seedProjects() {
  const rows = projects.map((p, index) => ({
    id: p.id,
    title_pt: p.title.pt,
    title_en: p.title.en,
    summary_pt: p.summary.pt,
    summary_en: p.summary.en,
    detail_pt: p.detail.pt,
    detail_en: p.detail.en,
    category: p.category,
    status: p.status,
    image: p.image,
    gallery: p.gallery ?? [],
    video_url: p.videoUrl ?? null,
    published: true,
    featured: p.featured,
    sort_order: index,
  }));

  const { error, count } = await supabase
    .from("projects")
    .upsert(rows, { onConflict: "id", count: "exact" });

  if (error) throw new Error(`projects: ${error.message}`);
  console.log(`projects: ${count ?? rows.length} linhas inseridas/atualizadas`);
}

const MONTH_ABBR_PT = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

function toEventDate(day: string, monthPt: string, year: string): string {
  const monthIndex = MONTH_ABBR_PT.indexOf(monthPt);
  if (monthIndex === -1) throw new Error(`Mês desconhecido: ${monthPt}`);
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${day.padStart(2, "0")}`;
}

async function seedEvents() {
  const rows = events.map((e, index) => ({
    id: e.id,
    event_date: toEventDate(e.day, e.month.pt, e.year),
    title_pt: e.title.pt,
    title_en: e.title.en,
    info_pt: e.info.pt,
    info_en: e.info.en,
    gallery: e.gallery ?? [],
    video_url: e.videoUrl ?? null,
    published: true,
    sort_order: index,
  }));

  const { error, count } = await supabase
    .from("events")
    .upsert(rows, { onConflict: "id", count: "exact" });

  if (error) throw new Error(`events: ${error.message}`);
  console.log(`events: ${count ?? rows.length} linhas inseridas/atualizadas`);
}

async function seedLeaders() {
  const rows = leaders.map((l, index) => ({
    name: l.name,
    role_pt: l.role.pt,
    role_en: l.role.en,
    photo: l.photo ?? null,
    sort_order: index,
  }));

  const { error: deleteError } = await supabase
    .from("leaders")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (deleteError) throw new Error(`leaders (delete): ${deleteError.message}`);

  const { error, count } = await supabase
    .from("leaders")
    .insert(rows, { count: "exact" });

  if (error) throw new Error(`leaders: ${error.message}`);
  console.log(`leaders: ${count ?? rows.length} linhas inseridas`);
}

async function seedAboutValues() {
  const rows = about.values.map((v, index) => ({
    title_pt: v.title.pt,
    title_en: v.title.en,
    text_pt: v.text.pt,
    text_en: v.text.en,
    sort_order: index,
  }));

  const { error: deleteError } = await supabase
    .from("about_values")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (deleteError)
    throw new Error(`about_values (delete): ${deleteError.message}`);

  const { error, count } = await supabase
    .from("about_values")
    .insert(rows, { count: "exact" });

  if (error) throw new Error(`about_values: ${error.message}`);
  console.log(`about_values: ${count ?? rows.length} linhas inseridas`);
}

async function seedSiteContent() {
  const row = {
    id: 1,
    club_name: club.name,
    club_district_pt: club.district.pt,
    club_district_en: club.district.en,
    club_acronym: club.acronym,
    club_founded: club.founded,
    hero_image: heroImage,
    mission_image: missionImage,
    home_headline_pt: home.headline.pt,
    home_headline_en: home.headline.en,
    home_lead_pt: home.lead.pt,
    home_lead_en: home.lead.en,
    home_invite_pt: home.invite.pt,
    home_invite_en: home.invite.en,
    about_mission_pt: about.mission.pt,
    about_mission_en: about.mission.en,
    about_ri_vision_pt: about.riVision.pt,
    about_ri_vision_en: about.riVision.en,
    about_ri_mission_pt: about.riMission.pt,
    about_ri_mission_en: about.riMission.en,
  };

  const { error } = await supabase.from("site_content").upsert(row);
  if (error) throw new Error(`site_content: ${error.message}`);
  console.log("site_content: 1 linha inserida/atualizada");
}

async function seedClubContacts() {
  const row = {
    id: 1,
    email: clubContacts.email,
    phone: clubContacts.phone,
    meetings_pt: clubContacts.meetings.pt,
    meetings_en: clubContacts.meetings.en,
    facebook: clubContacts.social.facebook,
    linkedin: clubContacts.social.linkedin,
    instagram: clubContacts.social.instagram,
  };

  const { error } = await supabase.from("club_contacts").upsert(row);
  if (error) throw new Error(`club_contacts: ${error.message}`);
  console.log("club_contacts: 1 linha inserida/atualizada");
}

async function main() {
  await seedProjects();
  await seedEvents();
  await seedLeaders();
  await seedAboutValues();
  await seedSiteContent();
  await seedClubContacts();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
