import { notFound } from "next/navigation";
import { getEvent, getGalleryItems } from "@/lib/queries";
import { updateEvent } from "../actions";
import EventForm from "../EventForm";

export default async function EditarEventoPage({
  params,
}: {
  params: { id: string };
}) {
  const [event, allGalleryItems] = await Promise.all([
    getEvent(params.id),
    getGalleryItems(),
  ]);
  if (!event) notFound();

  const galleryItems = allGalleryItems.filter((i) => i.eventId === event.id);

  return (
    <div>
      <h1 className="text-xl font-semibold text-neutral-900">Editar Evento</h1>
      <div className="mt-6">
        <EventForm
          action={updateEvent.bind(null, event.id)}
          event={event}
          galleryItems={galleryItems}
        />
      </div>
    </div>
  );
}
