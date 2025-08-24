import { LoaderFunctionArgs } from "@remix-run/node";
import { getProjects } from "../../../api/projects";
import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { getWorkspace, getWorkspaceBySlug } from "~/api/workspaces";
import { Outlet } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { Separator } from "~/components/ui/separator";
import type { Project } from "~/types/projects";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Ellipsis } from "lucide-react";
import { ProjectDialog } from "~/components/sidebar/Sidebar";
import { useState } from "react";
import { ProjectCreationDialog } from "~/components/sidebar/Sidebar";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const workspaceSlug = params.workspaceSlug || "personal"; // Default
  const workspace = await getWorkspaceBySlug(request, workspaceSlug);
  const projects = await getProjects(request, workspace.id);
  return { workspaceSlug, projects };
};

const Projects = () => {
  const { workspaceSlug, projects } = useLoaderData<typeof loader>();
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [dataProjectDialog, setDataProjectDialog] =
    useState<ProjectCreationDialog>({
      name: "",
      description: "",
      icon: "📚",
      color: "bw",
    });
  const [projectId, setProjectId] = useState("");
  useEffect(() => {
    console.log(dataProjectDialog);
  }, [dataProjectDialog]);

  return (
    <div className="w-full flex flex-col gap-y-2 mr-5 rounded-md py-4">
      <h1 className="text-xl font-bold font-serif px-4">Projects</h1>
      <Separator className="py-0 my-0" />
      <div className="w-full flex-1 min-w-0 relative flex flex-col">
        <div className="absolute inset-0 overflow-auto">
          {projects
            .sort((a: Project, b: Project) => {
              return (
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime()
              );
            })
            .map((project: Project) => (
              <Card className="transition-all duration-150 ease-in-out border-2 border-transparent hover:border-gray-300 hover:dark:border-gray-800">
                <CardHeader className="">
                  <div>
                    <CardTitle className="flex justify-between items-center">
                      <Link
                        to={`/${workspaceSlug}/${project.slug}`}
                        className="w-full flex gap-x-2"
                      >
                        <div>{project.ui_icon}</div>{" "}
                        <Separator orientation="vertical" className="h-4" />
                        <div>{project.name}</div>
                      </Link>
                      <div>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setDataProjectDialog({
                              name: project.name,
                              description: project.description,
                              icon: project.ui_icon,
                              color: project.ui_color,
                            });
                            setProjectId(project.id);
                            setProjectDialogOpen(true);
                          }}
                        >
                          <Ellipsis />
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </div>
                  <Separator />
                  <div className="flex flex-col text-sm text-gray-500">
                    <div>Number of notes: {project.notes.length}</div>
                    {/* <div>Last modified: {project.updated_at.toDateString( )}</div> */}
                  </div>
                </CardHeader>
              </Card>
            ))}
        </div>
      </div>
      <ProjectDialog
        key={projectId}
        dialogOpen={projectDialogOpen}
        setDialogOpen={setProjectDialogOpen}
        originalData={dataProjectDialog}
        projectId={projectId}
      />
    </div>
  );
};

export default Projects;
