import { getProjects } from "@/lib/supabase/queries";
import ProjectsView from "./ProjectsView";

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsView projects={projects} />;
}
