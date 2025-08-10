import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getProjectBySlug } from "~/api/projects";
import { getWorkspaceBySlug } from "~/api/workspaces";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Note } from "~/types/notes";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const workspaceSlug = params.workspaceSlug as string;
  const workspace = await getWorkspaceBySlug(request, workspaceSlug);
  console.log("workspace", workspace);
  const projectSlug = params.projectSlug as string;
  const project = await getProjectBySlug(request, workspace.id, projectSlug);
  console.log("project", project);
  return new Response(JSON.stringify({ project }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
const Project = () => {
  const { project } = useLoaderData<typeof loader>();
  return (
    <Card className="w-full mr-5">
      <CardContent>
        <div className="flex justify-between mt-6">
          <CardTitle className="text-xl font-serif">{project.name}</CardTitle>
          <div>Change layout</div>
        </div>
        <Separator className="h-0.5 bg-gray-400 dark:bg-gray-600" />
        {/* <div className="grid grid-cols-3 gap-2">
          <div className="px-2">Title</div>
          <div className="px-2">Content</div>
        </div>
        <Separator /> */}
        {project.notes?.map((note: Note) => (
          <NoteComponentList note={note} />
        ))}
      </CardContent>
    </Card>
  );
};

export default Project;

const NoteComponentList = ({ note }: { note: Note }) => {
  return (
    <Link className="mb-4" to={`${note.urlString}`}>
      <div className="grid grid-cols-3 gap-2 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-100 ease-in-out">
        <div className="flex justify-between">
          <div className="flex flex-col px-4 py-4 col-span-1">
            <div className="">{note.title}</div>
            <div className="text-xs text-gray-500">Summary of the note</div>
          </div>{" "}
          <Separator orientation="vertical" className="my-2 h-[80%]" />
        </div>
        <div className="flex items-center px-4 py-2 col-span-2 truncate w-[90%] text-sm">
          {note.text_content}{" "}
        </div>
        <div>
          {note.tags?.map((tag) => (
            <div>Tag 1</div>
          ))}
        </div>
      </div>
      <Separator />
    </Link>
  );
};
