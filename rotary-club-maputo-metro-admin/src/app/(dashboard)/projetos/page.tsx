import Link from "next/link";
import { getProjects, getCategories } from "@/lib/queries";
import { deleteProject } from "./actions";
import DeleteButton from "@/components/DeleteButton";
import AnimatedRows from "@/components/AnimatedRows";

export default async function ProjetosPage() {
  const [projects, categories] = await Promise.all([
    getProjects(),
    getCategories(),
  ]);
  const labelFor = (slug: string) =>
    categories.find((c) => c.slug === slug)?.labelPt ?? slug;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Projetos</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {projects.length} projeto(s)
          </p>
        </div>
        <Link
          href="/projetos/novo"
          className="rounded-md bg-rotary-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rotary-blue-dark"
        >
          Novo Projeto
        </Link>
      </div>

      <div className="mt-6 bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-500 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Destaque</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            <AnimatedRows
              rows={projects.map((p) => ({
                key: p.id,
                content: (
                  <>
                    <td className="px-4 py-3">{p.titlePt}</td>
                    <td className="px-4 py-3 text-neutral-600">
                      {labelFor(p.category)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs rounded px-2 py-0.5 ${
                          p.published
                            ? "bg-green-50 text-green-700"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        {p.published ? "Publicado" : "Rascunho"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-500">
                      {p.featured ? "Sim" : "—"}
                    </td>
                    <td className="px-4 py-3 text-right space-x-4 whitespace-nowrap">
                      <Link
                        href={`/projetos/${p.id}`}
                        className="text-sm font-medium text-rotary-blue transition-colors hover:underline"
                      >
                        Editar
                      </Link>
                      <DeleteButton
                        action={deleteProject.bind(null, p.id)}
                        confirmMessage={`Apagar o projeto "${p.titlePt}"? Esta ação não pode ser desfeita.`}
                      />
                    </td>
                  </>
                ),
              }))}
            />
            {projects.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-400">
                  Ainda não há projetos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
