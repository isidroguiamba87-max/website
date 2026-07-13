"use client";

import type { AdminEvent, GalleryItem } from "@/lib/types";
import EntityGallery from "@/components/EntityGallery";

const MAX_GALLERY_PHOTOS = 10;

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-rotary-blue";
const labelClass = "block text-sm font-medium text-neutral-700 mb-1";

function BilingualField({
  label,
  namePt,
  nameEn,
  defaultPt,
  defaultEn,
  textarea,
}: {
  label: string;
  namePt: string;
  nameEn: string;
  defaultPt?: string;
  defaultEn?: string;
  textarea?: boolean;
}) {
  const Field = textarea ? "textarea" : "input";
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label className={labelClass}>{label} (PT)</label>
        <Field
          name={namePt}
          defaultValue={defaultPt}
          required
          rows={textarea ? 4 : undefined}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>{label} (EN)</label>
        <Field
          name={nameEn}
          defaultValue={defaultEn}
          required
          rows={textarea ? 4 : undefined}
          className={inputClass}
        />
      </div>
    </div>
  );
}

export default function EventForm({
  action,
  event,
  galleryItems = [],
}: {
  action: (formData: FormData) => void;
  event?: AdminEvent;
  galleryItems?: GalleryItem[];
}) {
  return (
    <form action={action} className="space-y-5 max-w-3xl">
      <BilingualField
        label="Nome do evento"
        namePt="title_pt"
        nameEn="title_en"
        defaultPt={event?.titlePt}
        defaultEn={event?.titleEn}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Data</label>
          <input
            type="date"
            name="event_date"
            defaultValue={event?.eventDate}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Hora de início (opcional)</label>
          <input
            type="time"
            name="start_time"
            defaultValue={event?.startTime}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Hora de fim (opcional)</label>
          <input
            type="time"
            name="end_time"
            defaultValue={event?.endTime}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Local (nome, opcional)</label>
          <input
            name="location_name"
            defaultValue={event?.locationName}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Endereço (opcional)</label>
          <input
            name="location_address"
            defaultValue={event?.locationAddress}
            className={inputClass}
          />
        </div>
      </div>

      <BilingualField
        label="Descrição"
        namePt="info_pt"
        nameEn="info_en"
        defaultPt={event?.infoPt}
        defaultEn={event?.infoEn}
        textarea
      />

      <div>
        <label className={labelClass}>
          Galeria de fotos ({galleryItems.length}/{MAX_GALLERY_PHOTOS})
        </label>
        {event ? (
          <EntityGallery
            items={galleryItems}
            scope={{ eventId: event.id }}
            max={MAX_GALLERY_PHOTOS}
          />
        ) : (
          <p className="text-xs text-neutral-400">
            Guarda o evento primeiro — depois podes enviar até {MAX_GALLERY_PHOTOS}{" "}
            fotos aqui.
          </p>
        )}
      </div>

      <div>
        <label className={labelClass}>Vídeo (link do YouTube, opcional)</label>
        <input
          name="video_url"
          defaultValue={event?.videoUrl}
          className={inputClass}
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          name="intent"
          value="draft"
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
        >
          Guardar rascunho
        </button>
        <button
          type="submit"
          name="intent"
          value="publish"
          className="rounded-md bg-rotary-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rotary-blue-dark"
        >
          Publicar
        </button>
      </div>
    </form>
  );
}
