import { LoaderFunctionArgs } from "@remix-run/node";
import { getProjects } from "../../../api/projects";
import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { getWorkspace, getWorkspaceBySlug } from "~/api/workspaces";
import { Outlet } from "@remix-run/react";
import { Link } from "@remix-run/react";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const workspaceSlug = params.workspaceSlug || "personal"; // Default
  const workspace = await getWorkspaceBySlug(request, workspaceSlug);
  const projects = await getProjects(request, workspace.id);
  return { workspaceSlug, projects };
};

const Projects = () => {
  const { workspaceSlug, projects } = useLoaderData<typeof loader>();
  // useEffect(() => {
  //   console.log(loaderData);
  // }, []);

  return (
    <div className="w-full flex flex-col gap-y-2">
      {projects.map((project: any) => (
        <Link to={`/${workspaceSlug}/${project.slug}`} className="w-full">
          {project.name}
        </Link>
      ))}
      {/* <Outlet /> */}
    </div>
  );
};

export default Projects;
