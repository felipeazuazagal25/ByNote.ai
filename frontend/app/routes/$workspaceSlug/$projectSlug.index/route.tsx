import { Link, useOutletContext } from "@remix-run/react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import type { Note } from "~/types/notes";

export default function ProjectNotesList() {
  const { project } = useOutletContext<{ project: { notes: Note[] } }>();

  return (
    <div className="grid gap-2 w-full mr-5 outline">
      {project.notes.map((note) => (
        <Link key={note.id} to={`${note.id}`}>
          <motion.div
            layoutId={`note-${note.id}`}
            transition={{ layout: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } }}
            className="p-4 rounded-xl border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/40 shadow-sm"
          >
            <motion.div
              layout="position"
              className="font-semibold text-gray-800 dark:text-gray-100"
            >
              {note.title}
            </motion.div>
            <motion.div
              layout="position"
              className="text-sm text-gray-500 dark:text-gray-400 truncate"
            >
              {note.text_content}
            </motion.div>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
