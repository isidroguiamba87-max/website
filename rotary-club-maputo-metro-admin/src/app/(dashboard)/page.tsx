import { getDashboardCounts } from "@/lib/queries";
import DashboardCards, { type DashboardCard } from "./DashboardCards";
import QuickActions from "./QuickActions";

export default async function DashboardPage() {
  const counts = await getDashboardCounts();

  const cards: DashboardCard[] = [
    {
      label: "Projetos publicados",
      value: counts.projectsPublished,
      href: "/projetos",
      linkLabel: "Ver todos",
      icon: "briefcase",
      color: "blue",
    },
    {
      label: "Projetos em rascunho",
      value: counts.projectsDraft,
      href: "/projetos",
      linkLabel: "Ver rascunhos",
      icon: "draft",
      color: "emerald",
    },
    {
      label: "Eventos publicados",
      value: counts.eventsPublished,
      href: "/eventos",
      linkLabel: "Ver todos",
      icon: "calendar-check",
      color: "violet",
    },
    {
      label: "Eventos em rascunho",
      value: counts.eventsDraft,
      href: "/eventos",
      linkLabel: "Ver rascunhos",
      icon: "calendar",
      color: "amber",
    },
    {
      label: "Submissões por ler",
      value: counts.submissionsUnread,
      href: "/submissoes",
      linkLabel: "Ver submissões",
      icon: "send",
      color: "rose",
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-neutral-900">Início</h1>
      <p className="text-sm text-neutral-500 mt-1">
        Resumo do conteúdo do site.
      </p>

      <DashboardCards cards={cards} />

      <div className="mt-6">
        <QuickActions />
      </div>
    </div>
  );
}
