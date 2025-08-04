import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
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
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className="text-xl font-serif">{project.name}</CardTitle>
          <div>Change layout</div>
        </div>
        <Separator />
      </CardHeader>
      <CardContent>
        This is the list of notes
        {project.notes?.map((note: Note) => (
          <NoteComponent note={note} />
        ))}
      </CardContent>
    </Card>
  );
};

export default Project;

const NoteComponent = ({ note }: { note: Note }) => {
  return <div>this is the note {note.title}</div>;
};
