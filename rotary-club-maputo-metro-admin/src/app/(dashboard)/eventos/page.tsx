import Link from "next/link";
import { getEvents } from "@/lib/queries";
import { deleteEvent } from "./actions";
import DeleteButton from "@/components/DeleteButton";
import AnimatedRows from "@/components/AnimatedRows";

export default async function EventosPage() {
  const events = await getEvents();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Eventos</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {events.length} evento(s) — "Próximo"/"Anterior" é automático
            consoante a data.
          </p>
        </div>
        <Link
          href="/eventos/novo"
          className="rounded-md bg-rotary-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rotary-blue-dark"
        >
          Novo Evento
        </Link>
      </div>

      <div className="mt-6 bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-500 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Data</th>
              <th className="px-4 py-3 font-medium">Quando</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            <AnimatedRows
              rows={events.map((e) => ({
                key: e.id,
                content: (
                  <>
                    <td className="px-4 py-3">{e.titlePt}</td>
                    <td className="px-4 py-3 text-neutral-600">{e.eventDate}</td>
                    <td className="px-4 py-3 text-neutral-600">
                      {e.eventDate >= today ? "Próximo" : "Anterior"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs rounded px-2 py-0.5 ${
                          e.published
                            ? "bg-green-50 text-green-700"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        {e.published ? "Publicado" : "Rascunho"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-4 whitespace-nowrap">
                      <Link
                        href={`/eventos/${e.id}`}
                        className="text-sm font-medium text-rotary-blue transition-colors hover:underline"
                      >
                        Editar
                      </Link>
                      <DeleteButton
                        action={deleteEvent.bind(null, e.id)}
                        confirmMessage={`Apagar o evento "${e.titlePt}"? Esta ação não pode ser desfeita.`}
                      />
                    </td>
                  </>
                ),
              }))}
            />
            {events.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-400">
                  Ainda não há eventos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
