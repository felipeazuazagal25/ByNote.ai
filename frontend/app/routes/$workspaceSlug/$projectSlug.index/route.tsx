import { Link, useOutletContext } from "@remix-run/react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Project } from "~/types/projects";
import { Separator } from "~/components/ui/separator";
import { useScrollRestoration } from "~/hooks/useScrollRestoration";
import { useRef, useEffect } from "react";

export default function ProjectNotesList() {
  const { project } = useOutletContext<{ project: Project }>();
  const scrollRef = useScrollRestoration<HTMLDivElement>(
    `project-${project.id}-notes`
  );

  console.log("projects", project);

  return (
    <motion.div
      layout
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="h-full flex flex-col"
    >
      <CardHeader className="py-0 mb-0 mt-5">
        <CardTitle className="text-xl font-serif">{project.name}</CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="h-full flex-1 min-h-0 relative overflow-hidden">
        <div
          ref={scrollRef}
          className="gap-2 w-full mr-5 overflow-auto h-full absolute top-0 inset-0 p-5 flex flex-col gap-y-2"
        >
          {project.notes
            .sort((a, b) => {
              return (
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime()
              );
            })
            .map((note) => (
              <Link
                key={note.id}
                to={`${note.id}`}
                state={{ fromNoteList: true }}
              >
                <motion.div
                  layoutId={`note-${note.id}`}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="p-4 rounded-xl border shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  {/* Shared bounding box for the title */}
                  <motion.div
                    // layout="position"
                    layoutId={`note-title-${note.id}`}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="font-semibold text-gray-800 dark:text-gray-100"
                  >
                    {/* Static font size here, no animation */}
                    <span style={{ fontSize: "1rem", display: "inline-block" }}>
                      {note.title}
                    </span>
                  </motion.div>

                  {/* Extra content */}
                  <div>
                    <motion.div
                      layout="position"
                      className="text-sm text-gray-500 dark:text-gray-400 truncate"
                      initial={{ opacity: 0, y: 0 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                    >
                      {note.text_content}
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            ))}
        </div>
      </CardContent>
    </motion.div>
  );
}
