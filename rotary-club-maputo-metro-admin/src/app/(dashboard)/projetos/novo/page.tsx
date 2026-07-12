import { getCategories } from "@/lib/queries";
import { createProject } from "../actions";
import ProjectForm from "../ProjectForm";

export default async function NovoProjetoPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="text-xl font-semibold text-neutral-900">Novo Projeto</h1>
      <div className="mt-6">
        <ProjectForm action={createProject} categories={categories} />
      </div>
    </div>
  );
}
