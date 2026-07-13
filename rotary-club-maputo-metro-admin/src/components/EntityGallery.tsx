"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { setStatus, deleteItem } from "@/app/(dashboard)/galeria/actions";
import ConfirmModal from "@/components/ConfirmModal";
import { EASE, DURATION } from "@/lib/motion";
import type { GalleryItem } from "@/lib/types";

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

export default function EntityGallery({
  items,
  scope,
  max,
}: {
  items: GalleryItem[];
  scope: { projectId?: string; eventId?: string; newsId?: string };
  max: number;
}) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [removeTarget, setRemoveTarget] = useState<GalleryItem | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const remaining = max - items.length;
  const full = remaining <= 0;

  async function uploadFiles(files: FileList | File[]) {
    let list = Array.from(files);
    if (list.length === 0) return;

    if (list.length > remaining) {
      setErrors([
        `Só podes enviar mais ${remaining} foto${remaining === 1 ? "" : "s"} — o limite é ${max}.`,
      ]);
      list = list.slice(0, remaining);
      if (list.length === 0) return;
    } else {
      setErrors([]);
    }

    setUploading(true);
    const formData = new FormData();
    list.forEach((file) => formData.append("files", file));
    if (scope.projectId) formData.append("project_id", scope.projectId);
    if (scope.eventId) formData.append("event_id", scope.eventId);
    if (scope.newsId) formData.append("news_id", scope.newsId);

    try {
      const res = await fetch("/api/gallery/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      const failed = (json.results ?? []).filter((r: any) => r.error);
      if (failed.length > 0) {
        setErrors((prev) => [...prev, ...failed.map((f: any) => `${f.file}: ${f.error}`)]);
      }
    } catch {
      setErrors((prev) => [...prev, "Falha ao enviar. Tenta novamente."]);
    } finally {
      setUploading(false);
      router.refresh();
    }
  }

  async function approve(id: string) {
    setBusyId(id);
    try {
      await setStatus(id, "approved");
    } finally {
      setBusyId(null);
      router.refresh();
    }
  }

  async function confirmRemove() {
    if (!removeTarget) return;
    const { id, storagePath } = removeTarget;
    setRemoveTarget(null);
    setBusyId(id);
    try {
      await deleteItem(id, storagePath);
    } finally {
      setBusyId(null);
      router.refresh();
    }
  }

  return (
    <div>
      {items.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: reduced ? 0 : DURATION.base, ease: EASE }}
                className="relative rounded-md overflow-hidden border border-neutral-200 aspect-square bg-neutral-100"
              >
                {item.mediaType === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video src={item.url} className="w-full h-full object-cover" muted />
                )}

                <span
                  className={`absolute top-1.5 left-1.5 text-[10px] font-medium rounded px-1.5 py-0.5 ${STATUS_STYLES[item.status]}`}
                >
                  {STATUS_LABELS[item.status]}
                </span>

                <button
                  type="button"
                  disabled={busyId === item.id}
                  onClick={() => setRemoveTarget(item)}
                  aria-label="Remover"
                  className="absolute top-1.5 right-1.5 w-5 h-5 flex items-center justify-center rounded-full bg-black/60 text-white text-xs leading-none transition-colors hover:bg-black/80 disabled:opacity-50"
                >
                  ×
                </button>

                {item.status !== "approved" && (
                  <button
                    type="button"
                    disabled={busyId === item.id}
                    onClick={() => approve(item.id)}
                    className="absolute bottom-1.5 left-1.5 right-1.5 rounded bg-white/90 text-[10px] font-medium text-green-700 py-1 transition-colors hover:bg-white disabled:opacity-50"
                  >
                    {busyId === item.id ? "…" : "Aprovar"}
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!full && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            uploadFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={`rounded-md border-2 border-dashed px-4 py-6 text-center cursor-pointer transition-colors ${
            dragOver ? "border-rotary-blue bg-blue-50" : "border-neutral-300"
          }`}
        >
          <p className="text-xs text-neutral-600">
            {uploading
              ? "A enviar…"
              : `Arrasta fotos para aqui, ou clica para escolher (até ${remaining} ${remaining === 1 ? "foto" : "fotos"})`}
          </p>
          <input
            ref={inputRef}
            type="file"
            multiple={max > 1}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => e.target.files && uploadFiles(e.target.files)}
          />
        </div>
      )}

      {full && (
        <p className="text-xs text-neutral-400">
          {max === 1
            ? "Já tens uma foto de capa — remove-a primeiro para enviar outra."
            : `Limite de ${max} fotos atingido — remove uma para enviar outra.`}
        </p>
      )}

      {errors.length > 0 && (
        <div className="mt-2 text-xs text-red-600 space-y-1">
          {errors.map((e, i) => (
            <div key={i}>{e}</div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={removeTarget !== null}
        message="Remover esta foto? Não pode ser desfeito."
        onCancel={() => setRemoveTarget(null)}
        onConfirm={confirmRemove}
      />
    </div>
  );
}
