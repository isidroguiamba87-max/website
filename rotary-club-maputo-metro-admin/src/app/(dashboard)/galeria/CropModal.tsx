"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import type { GalleryItem } from "@/lib/types";
import { cropPhoto } from "./actions";

export default function CropModal({
  item,
  onClose,
}: {
  item: GalleryItem;
  onClose: () => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setArea(croppedAreaPixels);
  }, []);

  async function save() {
    if (!area) return;
    setSaving(true);
    try {
      await cropPhoto(item.id, item.storagePath, {
        left: area.x,
        top: area.y,
        width: area.width,
        height: area.height,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-lg overflow-hidden">
        <div className="relative h-80 bg-neutral-900">
          <Cropper
            image={item.url}
            crop={crop}
            zoom={zoom}
            aspect={undefined}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="p-4 flex items-center justify-between">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-32"
          />
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
            >
              Cancelar
            </button>
            <button
              onClick={save}
              disabled={saving || !area}
              className="rounded-md bg-rotary-blue px-3 py-1.5 text-sm text-white hover:bg-rotary-blue-dark"
            >
              {saving ? "A guardar…" : "Guardar recorte"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
