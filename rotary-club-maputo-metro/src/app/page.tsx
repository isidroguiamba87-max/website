import {
  getProjects,
  getEvents,
  getSiteContent,
  getGalleryItems,
} from "@/lib/supabase/queries";
import HomeView from "./HomeView";

export default async function HomePage() {
  const [projects, events, content] = await Promise.all([
    getProjects(),
    getEvents(),
    getSiteContent(),
  ]);

  const eventsWithGallery = await Promise.all(
    events.map(async (e) => ({
      ...e,
      galleryItems: await getGalleryItems({ eventId: e.id }),
    }))
  );

  return (
    <HomeView projects={projects} events={eventsWithGallery} content={content} />
  );
}
