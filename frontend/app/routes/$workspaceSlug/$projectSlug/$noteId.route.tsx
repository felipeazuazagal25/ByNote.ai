import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { getNote } from "~/api/notes";
import { motion } from "framer-motion";
import { Note } from "~/types/notes";
import { Project } from "~/types/projects";
import { getProjectBySlug } from "~/api/projects";
import { Workspace } from "~/types/workspaces";
import { getWorkspaceBySlug } from "~/api/workspaces";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const workspaceSlug = params.workspaceSlug as string;
  const projectSlug = params.projectSlug as string;
  const noteId = params.noteId as string;
  const note: Note = await getNote(request, noteId, projectSlug, workspaceSlug);
  // const note = {
  //   id: 21374,
  //   title: "new note",
  //   text_content: "asdljkaslkjflkdsa",
  // };
  return { note };
};

export default function NoteEditor() {
  const { note } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <motion.div
      layoutId={`note-${note.id}`}
      transition={{ layout: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } }}
      className="p-6 rounded-xl border w-full bg-white dark:bg-gray-800 shadow-lg mr-5"
    >
      <motion.div
        layout="position"
        className="flex justify-between items-center mb-4"
      >
        <motion.h2
          layout="position"
          className="text-2xl font-bold text-gray-900 dark:text-gray-100"
        >
          {note.title}
        </motion.h2>
        <motion.button
          layout
          onClick={() => navigate(-1)}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          Close
        </motion.button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0, duration: 0.25 }}
        className="text-gray-700 dark:text-gray-300 leading-relaxed"
      >
        {note.text_content}
      </motion.p>
    </motion.div>
  );
}
