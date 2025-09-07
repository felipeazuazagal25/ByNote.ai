import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getProjectBySlug } from "~/api/projects";
import { getWorkspaceBySlug } from "~/api/workspaces";
import { Card } from "~/components/ui/card";
import { useParams } from "@remix-run/react";
import { motion } from "framer-motion";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const workspaceSlug = params.workspaceSlug as string;
  const workspace = await getWorkspaceBySlug(request, workspaceSlug);
  const projectSlug = params.projectSlug as string;
  const project = await getProjectBySlug(request, workspace.id, projectSlug);
  return { project };
};

export default function ProjectLayout() {
  const { project }: any = useLoaderData();
  const params = useParams();

  return (
    <Card className="w-full mr-5 dark:bg-dark-bg dark:text-dark-text">
      <Outlet context={{ project }} key={params.noteId} />
    </Card>
  );
}

// const NoteComponentList = ({ note }: { note: Note }) => {
//   return (
//     <Link className="mb-4" to={`${note.urlString}`}>
//       <div className="grid grid-cols-3 gap-2 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-100 ease-in-out">
//         <div className="flex justify-between">
//           <div className="flex flex-col px-4 py-4 col-span-1">
//             <div className="">{note.title}</div>
//             <div className="text-xs text-gray-500">Summary of the note</div>
//           </div>{" "}
//           <Separator orientation="vertical" className="my-2 h-[80%]" />
//         </div>
//         <div className="flex items-center px-4 py-2 col-span-2 truncate w-[90%] text-sm">
//           {note.text_content}{" "}
//         </div>
//         <div>
//           {note.tags?.map((tag) => (
//             <div>Tag 1</div>
//           ))}
//         </div>
//       </div>
//       <Separator />
//     </Link>
//   );
// };
