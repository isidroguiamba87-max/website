import { createEvent } from "../actions";
import EventForm from "../EventForm";

export default function NovoEventoPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-neutral-900">Novo Evento</h1>
      <div className="mt-6">
        <EventForm action={createEvent} />
      </div>
    </div>
  );
}
