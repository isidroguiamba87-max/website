"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { GalleryItem } from "@/lib/types";
import {
  rotatePhoto,
  setCover,
  setStatus,
  updateCaption,
  deleteItem,
} from "./actions";
import CropModal from "./CropModal";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  approved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
};
const STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  approved: "Aprovada",
  rejected: "Recusada",
};

export default function GalleryItemCard({ item }: { item: GalleryItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });
  const [captionPt, setCaptionPt] = useState(item.captionPt);
  const [captionEn, setCaptionEn] = useState(item.captionEn);
  const [tag, setTag] = useState(item.tag);
  const [cropOpen, setCropOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-lg border border-neutral-200 bg-white overflow-hidden"
    >
      <div
        {...attributes}
        {...listeners}
        className="aspect-video bg-neutral-100 cursor-grab active:cursor-grabbing relative"
      >
        {item.mediaType === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.url}
            alt={item.captionPt || ""}
            className="w-full h-full object-cover"
          />
        ) : (
          <video src={item.url} className="w-full h-full object-cover" muted />
        )}
        {item.isCover && (
          <span className="absolute top-2 left-2 text-[10px] uppercase tracking-wide bg-rotary-blue text-white rounded px-1.5 py-0.5">
            Capa
          </span>
        )}
      </div>

      <div className="p-3 space-y-2">
        <span
          className={`inline-block text-xs rounded px-2 py-0.5 ${STATUS_STYLES[item.status]}`}
        >
          {STATUS_LABELS[item.status]}
        </span>

        <input
          value={captionPt}
          onChange={(e) => setCaptionPt(e.target.value)}
          onBlur={() => run(() => updateCaption(item.id, captionPt, captionEn, tag))}
          placeholder="Legenda (PT)"
          className="w-full rounded border border-neutral-200 px-2 py-1 text-xs"
        />
        <input
          value={captionEn}
          onChange={(e) => setCaptionEn(e.target.value)}
          onBlur={() => run(() => updateCaption(item.id, captionPt, captionEn, tag))}
          placeholder="Legenda (EN)"
          className="w-full rounded border border-neutral-200 px-2 py-1 text-xs"
        />
        <input
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          onBlur={() => run(() => updateCaption(item.id, captionPt, captionEn, tag))}
          placeholder="Etiqueta (opcional, para filtro)"
          className="w-full rounded border border-neutral-200 px-2 py-1 text-xs"
        />

        <div className="flex flex-wrap gap-1.5 pt-1">
          {item.status !== "approved" && (
            <button
              disabled={busy}
              onClick={() => run(() => setStatus(item.id, "approved"))}
              className="text-xs rounded bg-green-50 text-green-700 px-2 py-1 hover:bg-green-100"
            >
              Aprovar
            </button>
          )}
          {item.status !== "rejected" && (
            <button
              disabled={busy}
              onClick={() => run(() => setStatus(item.id, "rejected"))}
              className="text-xs rounded bg-red-50 text-red-700 px-2 py-1 hover:bg-red-100"
            >
              Recusar
            </button>
          )}
          {item.status !== "pending" && (
            <button
              disabled={busy}
              onClick={() => run(() => setStatus(item.id, "pending"))}
              className="text-xs rounded bg-neutral-100 text-neutral-600 px-2 py-1 hover:bg-neutral-200"
            >
              Pendente
            </button>
          )}
        </div>

        {item.mediaType === "image" && (
          <div className="flex flex-wrap gap-1.5">
            <button
              disabled={busy}
              onClick={() => run(() => rotatePhoto(item.id, item.storagePath))}
              className="text-xs rounded border border-neutral-300 px-2 py-1 hover:bg-neutral-100"
            >
              Rodar
            </button>
            <button
              disabled={busy}
              onClick={() => setCropOpen(true)}
              className="text-xs rounded border border-neutral-300 px-2 py-1 hover:bg-neutral-100"
            >
              Recortar
            </button>
            <button
              disabled={busy || item.isCover}
              onClick={() =>
                run(() => setCover(item.id, item.projectId, item.eventId, item.newsId))
              }
              className="text-xs rounded border border-neutral-300 px-2 py-1 hover:bg-neutral-100"
            >
              Definir como capa
            </button>
          </div>
        )}

        <button
          disabled={busy}
          onClick={() => {
            if (window.confirm("Apagar este ficheiro? Não pode ser desfeito.")) {
              run(() => deleteItem(item.id, item.storagePath));
            }
          }}
          className="text-xs font-medium text-red-600 hover:text-red-700"
        >
          Apagar
        </button>
      </div>

      {cropOpen && (
        <CropModal item={item} onClose={() => setCropOpen(false)} />
      )}
    </div>
  );
}
