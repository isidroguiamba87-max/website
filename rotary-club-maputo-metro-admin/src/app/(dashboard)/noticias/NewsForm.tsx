"use client";

import { useState } from "react";
import type { AdminNews, GalleryItem } from "@/lib/types";
import RichTextEditor from "@/components/RichTextEditor";
import EntityGallery from "@/components/EntityGallery";

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
          rows={textarea ? 3 : undefined}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>{label} (EN)</label>
        <Field
          name={nameEn}
          defaultValue={defaultEn}
          required
          rows={textarea ? 3 : undefined}
          className={inputClass}
        />
      </div>
    </div>
  );
}

export default function NewsForm({
  action,
  news,
  galleryItems = [],
}: {
  action: (formData: FormData) => void;
  news?: AdminNews;
  galleryItems?: GalleryItem[];
}) {
  const [bodyPt, setBodyPt] = useState(news?.bodyPt ?? "");
  const [bodyEn, setBodyEn] = useState(news?.bodyEn ?? "");

  return (
    <form action={action} className="space-y-5 max-w-3xl">
      <BilingualField
        label="Título"
        namePt="title_pt"
        nameEn="title_en"
        defaultPt={news?.titlePt}
        defaultEn={news?.titleEn}
      />
      <BilingualField
        label="Resumo curto"
        namePt="excerpt_pt"
        nameEn="excerpt_en"
        defaultPt={news?.excerptPt}
        defaultEn={news?.excerptEn}
        textarea
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Texto do artigo (PT)</label>
          <input type="hidden" name="body_pt" value={bodyPt} />
          <RichTextEditor value={bodyPt} onChange={setBodyPt} />
        </div>
        <div>
          <label className={labelClass}>Texto do artigo (EN)</label>
          <input type="hidden" name="body_en" value={bodyEn} />
          <RichTextEditor value={bodyEn} onChange={setBodyEn} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Autor (opcional)</label>
          <input name="author" defaultValue={news?.author} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Data de publicação</label>
          <input
            type="date"
            name="published_at"
            defaultValue={news?.publishedAt ?? new Date().toISOString().slice(0, 10)}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Foto de capa (1 foto)</label>
        {news ? (
          <EntityGallery
            items={galleryItems}
            scope={{ newsId: news.id }}
            max={1}
          />
        ) : (
          <p className="text-xs text-neutral-400">
            Guarda o artigo primeiro — depois podes enviar a foto de capa aqui.
          </p>
        )}
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
