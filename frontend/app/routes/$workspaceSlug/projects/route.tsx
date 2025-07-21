import { LoaderFunctionArgs } from "@remix-run/node";
import { getProjects } from "../../../api/projects";
import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { getWorkspace, getWorkspaceBySlug } from "~/api/workspaces";
import { Outlet } from "@remix-run/react";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const workspaceSlug = params.workspaceSlug || "personal"; // Default
  const workspace = await getWorkspaceBySlug(request, workspaceSlug);
  const projects = await getProjects(request, workspace.id);
  return { projects };
};

const Projects = () => {
  const loaderData = useLoaderData();
  useEffect(() => {
    console.log(loaderData);
  }, []);

  return (
    <div>
      This is a list of projects
      <Outlet />
    </div>
  );
};

export default Projects;
