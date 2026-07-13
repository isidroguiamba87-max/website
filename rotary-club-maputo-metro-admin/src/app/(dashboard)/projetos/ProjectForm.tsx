"use client";

import { useState } from "react";
import type { ProjectCategory, AdminProject, GalleryItem } from "@/lib/types";
import EntityGallery from "@/components/EntityGallery";

const MAX_GALLERY_PHOTOS = 10;

const NEW_CATEGORY_VALUE = "__new__";

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

export default function ProjectForm({
  action,
  categories,
  project,
  galleryItems = [],
}: {
  action: (formData: FormData) => void;
  categories: ProjectCategory[];
  project?: AdminProject;
  galleryItems?: GalleryItem[];
}) {
  const [addingCategory, setAddingCategory] = useState(false);

  return (
    <form action={action} className="space-y-5 max-w-3xl">
      <BilingualField
        label="Título"
        namePt="title_pt"
        nameEn="title_en"
        defaultPt={project?.titlePt}
        defaultEn={project?.titleEn}
      />
      <BilingualField
        label="Resumo curto"
        namePt="summary_pt"
        nameEn="summary_en"
        defaultPt={project?.summaryPt}
        defaultEn={project?.summaryEn}
        textarea
      />
      <BilingualField
        label="Descrição completa"
        namePt="detail_pt"
        nameEn="detail_en"
        defaultPt={project?.detailPt}
        defaultEn={project?.detailEn}
        textarea
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Categoria</label>
          <select
            name="category"
            defaultValue={project?.category ?? categories[0]?.slug}
            required
            className={inputClass}
            onChange={(e) => setAddingCategory(e.target.value === NEW_CATEGORY_VALUE)}
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.labelPt}
              </option>
            ))}
            <option value={NEW_CATEGORY_VALUE}>+ Nova categoria…</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Estado do projeto</label>
          <select
            name="status"
            defaultValue={project?.status ?? "active"}
            className={inputClass}
          >
            <option value="active">Ativo</option>
            <option value="completed">Concluído</option>
          </select>
        </div>
      </div>

      {addingCategory && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-md border border-dashed border-neutral-300 p-3">
          <div>
            <label className={labelClass}>Nome da nova categoria (PT)</label>
            <input name="new_category_label_pt" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Nome da nova categoria (EN)</label>
            <input name="new_category_label_en" className={inputClass} />
          </div>
        </div>
      )}

      <div>
        <label className={labelClass}>Foto de capa (caminho ou URL)</label>
        <input
          name="image"
          defaultValue={project?.image}
          required
          className={inputClass}
          placeholder="/images/gallery/photo-01.jpg"
        />
      </div>

      <div>
        <label className={labelClass}>
          Galeria de fotos ({galleryItems.length}/{MAX_GALLERY_PHOTOS})
        </label>
        {project ? (
          <EntityGallery
            items={galleryItems}
            scope={{ projectId: project.id }}
            max={MAX_GALLERY_PHOTOS}
          />
        ) : (
          <p className="text-xs text-neutral-400">
            Guarda o projeto primeiro — depois podes enviar até {MAX_GALLERY_PHOTOS}{" "}
            fotos aqui.
          </p>
        )}
      </div>

      <div>
        <label className={labelClass}>Vídeo (link do YouTube, opcional)</label>
        <input
          name="video_url"
          defaultValue={project?.videoUrl}
          className={inputClass}
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={project?.featured}
          className="rounded border-neutral-300"
        />
        Destacar na página inicial
      </label>

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
