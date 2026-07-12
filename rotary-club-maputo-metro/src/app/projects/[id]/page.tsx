import { notFound } from "next/navigation";
import { getProject, getGalleryItems } from "@/lib/supabase/queries";
import ProjectDetailView from "./ProjectDetailView";

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await getProject(params.id);
  if (!project) notFound();

  const galleryItems = await getGalleryItems({ projectId: project.id });

  return <ProjectDetailView project={project} galleryItems={galleryItems} />;
}
