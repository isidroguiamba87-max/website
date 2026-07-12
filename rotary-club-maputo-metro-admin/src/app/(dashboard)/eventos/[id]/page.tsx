import { notFound } from "next/navigation";
import { getEvent } from "@/lib/queries";
import { updateEvent } from "../actions";
import EventForm from "../EventForm";

export default async function EditarEventoPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await getEvent(params.id);
  if (!event) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold text-neutral-900">Editar Evento</h1>
      <div className="mt-6">
        <EventForm action={updateEvent.bind(null, event.id)} event={event} />
      </div>
    </div>
  );
}
