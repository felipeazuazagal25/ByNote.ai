import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useLocation, useNavigate } from "@remix-run/react";
import { getNote } from "~/api/notes";
import { delay, motion } from "framer-motion";
import { Note } from "~/types/notes";
import { Separator } from "~/components/ui/separator";
import { useEffect, useState } from "react";
import { useOutletContext } from "@remix-run/react";
import type { Project } from "~/types/projects";
import { Button } from "~/components/ui/button";

import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { SimpleEditor } from "~/components/tiptap-templates/simple/simple-editor";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const workspaceSlug = params.workspaceSlug as string;
  const projectSlug = params.projectSlug as string;
  const noteId = params.noteId as string;
  const note: Note = await getNote(request, noteId, projectSlug, workspaceSlug);
  return { note, projectSlug, workspaceSlug };
};

export default function NoteEditor() {
  const { note, projectSlug, workspaceSlug } = useLoaderData<typeof loader>();
  // const { project } = useOutletContext<{ project: Project }>();
  const [content, setContent] = useState(note.rich_content);

  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "h-full outline-none",
        style: "box-sizing: border-box;",
      },
    },
  });

  useEffect(() => {
    console.log("this is the new content", content);
  }, [content]);

  return (
    <motion.div
      // avoid animating height — animate position only to prevent size jumps
      layout="position"
      layoutId={`note-${note.id}`}
      className="p-6 w-full h-full flex flex-col overflow-hidden"
      transition={{ layout: { duration: 0.15, ease: "easeOut" } }}
    >
      {/* Title */}
      <motion.div
        layoutId={`note-title-${note.id}`}
        transition={{ layout: { duration: 0.15, ease: "easeOut" } }}
        className="flex justify-between items-center mb-4 font-semibold"
      >
        <motion.span
          initial={false}
          layout="position"
          className="inline-block"
          transition={{ layout: { duration: 0.15, ease: "easeOut" } }}
        >
          {note.title}
        </motion.span>

        <Button
          onClick={() => navigate(`/${workspaceSlug}/${projectSlug}`)}
          className="px-3 py-1"
        >
          Close
        </Button>
      </motion.div>

      <Separator />

      {/* scrollable wrapper: flex-1 + min-h-0 is the key */}
      <div className="flex-1 min-h-0 relative">
        <EditorContent
          editor={editor}
          className="absolute inset-0 overflow-auto p-4"
        />
      </div>
    </motion.div>
  );
}
