import Link from "next/link";
import { getSubmissions } from "@/lib/queries";
import AnimatedRows from "@/components/AnimatedRows";

const SOURCE_LABEL: Record<string, string> = {
  contact: "Contacto",
  "get-involved": "Envolver-se",
};

const STATUS_LABEL: Record<string, string> = {
  unread: "Por ler",
  read: "Lida",
  replied: "Respondida",
};

const STATUS_BADGE: Record<string, string> = {
  unread: "bg-rotary-blue/10 text-rotary-blue",
  read: "bg-neutral-100 text-neutral-500",
  replied: "bg-green-50 text-green-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function SubmissoesPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const all = await getSubmissions();
  const filter = searchParams.status;
  const visible = filter ? all.filter((s) => s.status === filter) : all;

  const tabs: { key: string | undefined; label: string; count: number }[] = [
    { key: undefined, label: "Todas", count: all.length },
    {
      key: "unread",
      label: "Por ler",
      count: all.filter((s) => s.status === "unread").length,
    },
    {
      key: "read",
      label: "Lidas",
      count: all.filter((s) => s.status === "read").length,
    },
    {
      key: "replied",
      label: "Respondidas",
      count: all.filter((s) => s.status === "replied").length,
    },
  ];

  return (
    <div>
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Submissões</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Mensagens recebidas dos formulários de Contacto e Envolver-se.
        </p>
      </div>

      <div className="flex gap-2 mt-5">
        {tabs.map((tab) => {
          const active = filter === tab.key;
          const href = tab.key ? `/submissoes?status=${tab.key}` : "/submissoes";
          return (
            <Link
              key={tab.label}
              href={href}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? "bg-rotary-blue text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {tab.label} <span className="opacity-70">({tab.count})</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-5 bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-500 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">De</th>
              <th className="px-4 py-3 font-medium">Origem</th>
              <th className="px-4 py-3 font-medium">Recebida</th>
              <th className="px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            <AnimatedRows
              rows={visible.map((s) => ({
                key: s.id,
                content: (
                  <>
                    <td className="p-0">
                      <Link href={`/submissoes/${s.id}`} className="block px-4 py-3">
                        <span
                          className={
                            s.status === "unread"
                              ? "font-semibold text-neutral-900"
                              : "font-medium text-neutral-700"
                          }
                        >
                          {s.status === "unread" && (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-rotary-blue mr-2 align-middle" />
                          )}
                          {s.name}
                        </span>
                        <div className="text-xs text-neutral-400">{s.email}</div>
                      </Link>
                    </td>
                    <td className="p-0">
                      <Link
                        href={`/submissoes/${s.id}`}
                        className="block px-4 py-3 text-neutral-600"
                      >
                        {SOURCE_LABEL[s.source] ?? s.source}
                      </Link>
                    </td>
                    <td className="p-0">
                      <Link
                        href={`/submissoes/${s.id}`}
                        className="block px-4 py-3 text-neutral-500 whitespace-nowrap"
                      >
                        {formatDate(s.createdAt)}
                      </Link>
                    </td>
                    <td className="p-0">
                      <Link href={`/submissoes/${s.id}`} className="block px-4 py-3">
                        <span
                          className={`text-xs rounded px-2 py-0.5 ${STATUS_BADGE[s.status]}`}
                        >
                          {STATUS_LABEL[s.status]}
                        </span>
                      </Link>
                    </td>
                  </>
                ),
              }))}
            />
            {visible.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-neutral-400">
                  Sem submissões nesta vista.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
