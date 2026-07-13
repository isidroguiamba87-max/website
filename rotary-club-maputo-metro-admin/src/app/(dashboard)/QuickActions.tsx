import Link from "next/link";
import {
  IconPlusCircle,
  IconCalendarPlus,
  IconFileText,
  IconSend,
} from "@/components/icons";

const ACTIONS = [
  {
    label: "Novo Projeto",
    href: "/projetos/novo",
    icon: IconPlusCircle,
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
  {
    label: "Novo Evento",
    href: "/eventos/novo",
    icon: IconCalendarPlus,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  {
    label: "Nova Notícia",
    href: "/noticias/novo",
    icon: IconFileText,
    bg: "bg-violet-50",
    text: "text-violet-700",
  },
  {
    label: "Ver Submissões",
    href: "/submissoes",
    icon: IconSend,
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5">
      <h2 className="text-sm font-semibold text-neutral-700 mb-3">Ações rápidas</h2>
      <div className="grid grid-cols-2 gap-3">
        {ACTIONS.map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className={`flex items-center gap-2.5 rounded-md ${a.bg} ${a.text} px-3 py-2.5 text-sm font-medium transition-opacity hover:opacity-80`}
          >
            <a.icon className="w-4 h-4 shrink-0" />
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
