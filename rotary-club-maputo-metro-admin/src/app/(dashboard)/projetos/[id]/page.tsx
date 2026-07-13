import { notFound } from "next/navigation";
import { getCategories, getProject, getGalleryItems } from "@/lib/queries";
import { updateProject } from "../actions";
import ProjectForm from "../ProjectForm";

export default async function EditarProjetoPage({
  params,
}: {
  params: { id: string };
}) {
  const [categories, project, allGalleryItems] = await Promise.all([
    getCategories(),
    getProject(params.id),
    getGalleryItems(),
  ]);

  if (!project) notFound();

  const galleryItems = allGalleryItems.filter((i) => i.projectId === project.id);

  return (
    <div>
      <h1 className="text-xl font-semibold text-neutral-900">
        Editar Projeto
      </h1>
      <div className="mt-6">
        <ProjectForm
          action={updateProject.bind(null, project.id)}
          categories={categories}
          project={project}
          galleryItems={galleryItems}
        />
      </div>
    </div>
  );
}
