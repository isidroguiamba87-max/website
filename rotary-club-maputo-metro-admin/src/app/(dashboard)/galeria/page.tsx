import Link from "next/link";
import { getGalleryItems, getProjects, getEvents, getNewsList } from "@/lib/queries";
import GalleryManager from "./GalleryManager";

export default async function GaleriaPage() {
  const [items, projects, events, news] = await Promise.all([
    getGalleryItems(),
    getProjects(),
    getEvents(),
    getNewsList(),
  ]);

  const groupOptions = [
    { value: "general", label: "Galeria Geral" },
    ...projects.map((p) => ({ value: `project:${p.id}`, label: `Projeto: ${p.titlePt}` })),
    ...events.map((e) => ({ value: `event:${e.id}`, label: `Evento: ${e.titlePt}` })),
    ...news.map((n) => ({ value: `news:${n.id}`, label: `Notícia: ${n.titlePt}` })),
  ];

  const labelFor = (projectId: string | null, eventId: string | null, newsId: string | null) => {
    if (projectId) return `Projeto: ${projects.find((p) => p.id === projectId)?.titlePt ?? projectId}`;
    if (eventId) return `Evento: ${events.find((e) => e.id === eventId)?.titlePt ?? eventId}`;
    if (newsId) return `Notícia: ${news.find((n) => n.id === newsId)?.titlePt ?? newsId}`;
    return "Galeria Geral";
  };

  const itemsWithGroupLabel = items.map((item) => ({
    ...item,
    groupLabel: labelFor(item.projectId, item.eventId, item.newsId),
  }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Galeria</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {items.length} ficheiro(s) — só fotos/vídeos Aprovados aparecem no site.
          </p>
        </div>
        <Link
          href="/galeria/definicoes"
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
        >
          Estilo da Galeria
        </Link>
      </div>

      <div className="mt-6">
        <GalleryManager items={itemsWithGroupLabel} groupOptions={groupOptions} />
      </div>
    </div>
  );
}
