import { getEvents, getGalleryItems } from "@/lib/supabase/queries";
import EventsView from "./EventsView";

export default async function EventsPage() {
  const events = await getEvents();

  const eventsWithGallery = await Promise.all(
    events.map(async (e) => ({
      ...e,
      galleryItems: await getGalleryItems({ eventId: e.id }),
    }))
  );

  return <EventsView events={eventsWithGallery} />;
}
