import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";

const NAV_ACTIVE = [
  { href: "/", label: "Dashboard" },
  { href: "/projetos", label: "Projetos" },
  { href: "/eventos", label: "Eventos" },
  { href: "/noticias", label: "Notícias" },
  { href: "/galeria", label: "Galeria" },
];

const NAV_SOON = ["Submissões", "Utilizadores"];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 shrink-0 border-r border-neutral-200 bg-white flex flex-col">
        <div className="px-5 py-5 border-b border-neutral-100">
          <div className="text-sm font-semibold text-rotary-blue leading-tight">
            Rotary Club
            <br />
            Maputo Metro
          </div>
          <div className="text-xs text-neutral-400 mt-0.5">Administração</div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ACTIVE.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 mt-2 border-t border-neutral-100">
            {NAV_SOON.map((label) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-neutral-400"
              >
                <span>{label}</span>
                <span className="text-[10px] uppercase tracking-wide bg-neutral-100 text-neutral-400 rounded px-1.5 py-0.5">
                  Em breve
                </span>
              </div>
            ))}
          </div>
        </nav>

        <div className="px-3 py-4 border-t border-neutral-100">
          <div className="px-3 text-xs text-neutral-400 truncate mb-2">
            {user?.email}
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="w-full text-left rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
            >
              Sair
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 px-8 py-8">{children}</main>
    </div>
  );
}
