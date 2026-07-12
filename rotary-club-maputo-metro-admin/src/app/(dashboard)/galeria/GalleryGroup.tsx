"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import type { GalleryItem } from "@/lib/types";
import { reorderItems } from "./actions";
import GalleryItemCard from "./GalleryItemCard";

export default function GalleryGroup({
  label,
  items,
}: {
  label: string;
  items: GalleryItem[];
}) {
  const [ordered, setOrdered] = useState(items);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = ordered.findIndex((i) => i.id === active.id);
    const newIndex = ordered.findIndex((i) => i.id === over.id);
    const next = arrayMove(ordered, oldIndex, newIndex);
    setOrdered(next);
    await reorderItems(next.map((i) => i.id));
  }

  return (
    <div className="mb-10">
      <h2 className="text-sm font-semibold text-neutral-700 mb-3">
        {label} <span className="text-neutral-400 font-normal">({ordered.length})</span>
      </h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={ordered.map((i) => i.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ordered.map((item) => (
              <GalleryItemCard key={item.id} item={item} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
