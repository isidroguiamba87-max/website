import Link from "next/link";
import { getDashboardCounts } from "@/lib/queries";

export default async function DashboardPage() {
  const counts = await getDashboardCounts();

  const cards = [
    {
      label: "Projetos publicados",
      value: counts.projectsPublished,
      href: "/projetos",
    },
    {
      label: "Projetos em rascunho",
      value: counts.projectsDraft,
      href: "/projetos",
    },
    {
      label: "Eventos publicados",
      value: counts.eventsPublished,
      href: "/eventos",
    },
    {
      label: "Eventos em rascunho",
      value: counts.eventsDraft,
      href: "/eventos",
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-neutral-900">Início</h1>
      <p className="text-sm text-neutral-500 mt-1">
        Resumo do conteúdo do site.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-lg border border-neutral-200 bg-white p-5 hover:border-rotary-blue transition-colors"
          >
            <div className="text-2xl font-semibold text-rotary-blue">
              {c.value}
            </div>
            <div className="text-sm text-neutral-500 mt-1">{c.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
