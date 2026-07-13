"use client";

import { useMemo, useState } from "react";
import type { GalleryItem, GallerySettings } from "@/lib/types";
import { updateGallerySettings } from "./actions";
import PreviewGallery from "./PreviewGallery";

const STYLES: { value: GallerySettings["style"]; label: string }[] = [
  { value: "grid", label: "Grelha (Grid)" },
  { value: "masonry", label: "Alvenaria (Masonry)" },
  { value: "justified", label: "Justificada" },
  { value: "carousel", label: "Carrossel" },
  { value: "slideshow", label: "Slideshow" },
];

type ItemWithGroup = GalleryItem & { groupLabel: string };

export default function GallerySettingsForm({
  items,
  initialSettings,
}: {
  items: ItemWithGroup[];
  initialSettings: GallerySettings;
}) {
  const groupLabels = useMemo(
    () => Array.from(new Set(items.map((i) => i.groupLabel))),
    [items]
  );
  const [group, setGroup] = useState(groupLabels[0] ?? "");
  const [style, setStyle] = useState(initialSettings.style);
  const [fullscreen, setFullscreen] = useState(initialSettings.fullscreen);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const previewItems = items.filter((i) => i.groupLabel === group);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await updateGallerySettings({ style, fullscreen });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid md:grid-cols-[280px_1fr] gap-8">
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Pré-visualizar com
          </label>
          <select
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            {groupLabels.length === 0 && <option>Sem fotos aprovadas ainda</option>}
            {groupLabels.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Estilo da galeria
          </label>
          <div className="space-y-2">
            {STYLES.map((s) => (
              <label key={s.value} className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="radio"
                  name="style"
                  checked={style === s.value}
                  onChange={() => setStyle(s.value)}
                />
                {s.label}
              </label>
            ))}
          </div>
        </div>

        {style === "slideshow" && (
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              checked={fullscreen}
              onChange={(e) => setFullscreen(e.target.checked)}
            />
            Modo ecrã inteiro
          </label>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-md bg-rotary-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rotary-blue-dark disabled:opacity-60"
        >
          {saving ? "A guardar…" : "Guardar e publicar"}
        </button>
        {saved && (
          <p className="text-sm text-green-700">
            Estilo guardado — o site já está a usar este layout.
          </p>
        )}
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-5">
        <PreviewGallery items={previewItems} settings={{ style, fullscreen }} />
      </div>
    </div>
  );
}
