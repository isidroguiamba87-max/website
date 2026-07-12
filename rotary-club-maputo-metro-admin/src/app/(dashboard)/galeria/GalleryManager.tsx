"use client";

import type { GalleryItem } from "@/lib/types";
import UploadBox from "./UploadBox";
import GalleryGroup from "./GalleryGroup";

type ItemWithGroup = GalleryItem & { groupLabel: string };

export default function GalleryManager({
  items,
  groupOptions,
}: {
  items: ItemWithGroup[];
  groupOptions: { value: string; label: string }[];
}) {
  const groups = new Map<string, ItemWithGroup[]>();
  for (const item of items) {
    const key = item.groupLabel;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  }

  return (
    <div>
      <UploadBox groupOptions={groupOptions} />

      {groups.size === 0 && (
        <p className="text-sm text-neutral-400">
          Ainda não há fotos ou vídeos na galeria.
        </p>
      )}

      {Array.from(groups.entries()).map(([label, groupItems]) => (
        <GalleryGroup key={label} label={label} items={groupItems} />
      ))}
    </div>
  );
}
