import Link from "next/link";
import { getNewsList } from "@/lib/queries";
import { deleteNews } from "./actions";
import DeleteButton from "@/components/DeleteButton";

export default async function NoticiasPage() {
  const news = await getNewsList();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Notícias</h1>
          <p className="text-sm text-neutral-500 mt-1">{news.length} artigo(s)</p>
        </div>
        <Link
          href="/noticias/novo"
          className="rounded-md bg-rotary-blue px-4 py-2 text-sm font-medium text-white hover:bg-rotary-blue-dark"
        >
          Novo Artigo
        </Link>
      </div>

      <div className="mt-6 bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-500 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Data</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {news.map((n) => (
              <tr key={n.id} className="border-t border-neutral-100">
                <td className="px-4 py-3">{n.titlePt}</td>
                <td className="px-4 py-3 text-neutral-600">{n.publishedAt}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs rounded px-2 py-0.5 ${
                      n.published
                        ? "bg-green-50 text-green-700"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {n.published ? "Publicado" : "Rascunho"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-4 whitespace-nowrap">
                  <Link
                    href={`/noticias/${n.id}`}
                    className="text-sm font-medium text-rotary-blue hover:underline"
                  >
                    Editar
                  </Link>
                  <DeleteButton
                    action={deleteNews.bind(null, n.id)}
                    confirmMessage={`Apagar o artigo "${n.titlePt}"? Esta ação não pode ser desfeita.`}
                  />
                </td>
              </tr>
            ))}
            {news.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-neutral-400">
                  Ainda não há notícias.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
