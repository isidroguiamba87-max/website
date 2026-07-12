import { getGalleryItems, getGallerySettings, getProjects, getEvents } from "@/lib/queries";
import GallerySettingsForm from "./GallerySettingsForm";

export default async function DefinicoesGaleriaPage() {
  const [items, settings, projects, events] = await Promise.all([
    getGalleryItems(),
    getGallerySettings(),
    getProjects(),
    getEvents(),
  ]);

  const approved = items.filter((i) => i.status === "approved");

  const labelFor = (projectId: string | null, eventId: string | null) => {
    if (projectId) return `Projeto: ${projects.find((p) => p.id === projectId)?.titlePt ?? projectId}`;
    if (eventId) return `Evento: ${events.find((e) => e.id === eventId)?.titlePt ?? eventId}`;
    return "Galeria Geral";
  };

  const itemsWithGroupLabel = approved.map((item) => ({
    ...item,
    groupLabel: labelFor(item.projectId, item.eventId),
  }));

  return (
    <div>
      <h1 className="text-xl font-semibold text-neutral-900">Estilo da Galeria</h1>
      <p className="text-sm text-neutral-500 mt-1">
        Escolhe o estilo e pré-visualiza com fotos reais antes de publicar no site.
      </p>
      <div className="mt-6">
        <GallerySettingsForm items={itemsWithGroupLabel} initialSettings={settings} />
      </div>
    </div>
  );
}
