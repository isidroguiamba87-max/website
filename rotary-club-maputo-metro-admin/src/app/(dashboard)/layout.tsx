import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";
import SidebarNav from "@/components/SidebarNav";
import PageTransition from "@/components/PageTransition";

const NAV_ACTIVE = [
  { href: "/", label: "Dashboard" },
  { href: "/projetos", label: "Projetos" },
  { href: "/eventos", label: "Eventos" },
  { href: "/noticias", label: "Notícias" },
  { href: "/galeria", label: "Galeria" },
  { href: "/submissoes", label: "Submissões" },
  { href: "/utilizadores", label: "Utilizadores" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { count: unreadCount } = await supabase
    .from("submissions")
    .select("id", { count: "exact", head: true })
    .eq("status", "unread");

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 shrink-0 border-r border-neutral-200 bg-white flex flex-col">
        <div className="px-5 py-5 border-b border-neutral-100 flex items-center gap-3">
          <Image
            src="/images/logo2.png"
            alt="Rotary Club of Maputo Metro"
            width={36}
            height={36}
            className="shrink-0"
          />
          <div>
            <div className="text-sm font-semibold text-rotary-blue leading-tight">
              Rotary Club
              <br />
              Maputo Metro
            </div>
            <div className="text-xs text-neutral-400 mt-0.5">Administração</div>
          </div>
        </div>

        <SidebarNav items={NAV_ACTIVE} unreadCount={unreadCount ?? 0} />

        <div className="px-3 py-4 border-t border-neutral-100">
          <div className="px-3 text-xs text-neutral-400 truncate mb-2">
            {user?.email}
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="w-full text-left rounded-md px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100"
            >
              Sair
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 px-8 py-8">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
