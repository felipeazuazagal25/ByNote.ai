import { LoaderFunctionArgs } from "@remix-run/node";
import {
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigate,
} from "@remix-run/react";
import { getNote } from "~/api/notes";
import { motion } from "framer-motion";
import { Note } from "~/types/notes";
import { Separator } from "~/components/ui/separator";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useOutletContext } from "@remix-run/react";
import type { Project } from "~/types/projects";
import { Button } from "~/components/ui/button";
import { TrashIcon } from "lucide-react";
import { useParams, useNavigation } from "@remix-run/react";

// TIPTAP EDITOR
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import Highlight from "@tiptap/extension-highlight";
import { ListButton } from "~/components/tiptap-ui/list-button";

// TipTap Extensions -- External
import Document from "@tiptap/extension-document";
import { ListKit } from "@tiptap/extension-list";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";

// Tiptap Extensions -- Internal
import SlashCommand from "~/components/editor/extensions/slashCommand";
import ListExitOnEmpty from "~/components/editor/extensions/listExitOnEmpty";
// import { SimpleEditor } from "~/components/tiptap-templates/simple/simple-editor";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const workspaceSlug = params.workspaceSlug as string;
  const projectSlug = params.projectSlug as string;
  const noteId = params.noteId as string;
  const initialNote: Note = await getNote(
    request,
    noteId,
    projectSlug,
    workspaceSlug
  );
  return { initialNote, projectSlug, workspaceSlug };
};

export default function NoteEditor() {
  // -------------------- INITIAL VARIABLES --------------------
  const { initialNote, projectSlug, workspaceSlug } =
    useLoaderData<typeof loader>();
  // const { project } = useOutletContext<{ project: Project }>();

  // -------------------- GENERAL VARIABLES --------------------
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const navigation = useNavigation();

  // -------------------- CONTENT / UI STATE VARIABLES --------------------
  const [title, setTitle] = useState(initialNote.title);
  const [content, setContent] = useState(initialNote.rich_content);
  const [note, setNote] = useState(initialNote);
  const [open, setOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // -------------------- TIPTAP EDITOR --------------------
  const editor = useEditor({
    extensions: [
      StarterKit,
      Document,
      Paragraph,
      Text,
      ListKit,
      SlashCommand,
      ListExitOnEmpty,
    ],
    content: initialNote.rich_content,
    immediatelyRender: false,
    autofocus: "end",
    editorProps: {
      attributes: {
        class: "h-full outline-none w-full prose",
        style: "box-sizing: border-box;",
        tabindex: "10",
      },
    },
    onUpdate: ({ editor }: { editor: any }) => {
      // console.log(editor.getHTML());
      const newContent = editor.getJSON();
      const newTextContent = editor.getText();
      const newNote = {
        ...note,
        rich_content: newContent,
        text_content: newTextContent,
      };
      setNote(newNote);
      setContent(newContent);
    },
  });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    // This will trigger a re-render when the URL params change
    // console.log("Note ID changed:", params.noteId);
  }, [params.noteId]);

  const noteFetcher = useFetcher();

  useEffect(() => {
    // console.log("new retrigger");
    const updateNote = setTimeout(async () => {
      const { tags, slug, urlString, updated_at, created_at, ...newNote } = {
        ...note,
        title: title,
        text_content: editor?.getText() || "",
        rich_content: JSON.stringify(editor?.getJSON()),
      };
      if (!editor?.getJSON()) {
        return;
      }
      // console.log("this is the new note to edit", newNote);
      await noteFetcher.submit(newNote, {
        method: "put",
        action: `/api/notes/edit`,
      });
      // console.log("note updated");
    }, 500);
    return () => clearTimeout(updateNote);
  }, [content, title]);

  const handleDelete = () => {
    const formData = { redirectLink: `/${workspaceSlug}/${projectSlug}` };
    // console.log("initiaing the delete process", formData);
    return noteFetcher.submit(formData, {
      method: "delete",
      action: `/api/notes/delete/${note.id}`,
    });
  };

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
        className="flex justify-between items-center mb-4 font-semibold w-full"
      >
        <motion.span
          initial={false}
          layout="position"
          className="inline-block w-full"
          transition={{ layout: { duration: 0.15, ease: "easeOut" } }}
        >
          <input
            tabIndex={10}
            value={title}
            className="w-full focus:outline-none bg-white dark:bg-transparent"
            onChange={(e) => {
              const newTitle = e.target.value;
              const newNote = { ...note, title: title };
              setTitle(newTitle);
              setNote(newNote);
            }}
          />
        </motion.span>

        <div className="flex gap-x-2">
          <Button
            variant="secondary"
            tabIndex={12}
            onClick={() => navigate(`/${workspaceSlug}/${projectSlug}`)}
            className="px-3 py-1"
          >
            Close
          </Button>
          <Button
            variant="destructive"
            tabIndex={12}
            onClick={handleDelete}
            className="px-3 py-1"
          >
            <TrashIcon />
            Remove
          </Button>
        </div>
      </motion.div>

      <Separator className="mb-4" />

      {/* scrollable wrapper: flex-1 + min-h-0 is the key */}

      <motion.div
        key={`${note.id}-editor`}
        className="flex-1 min-h-0 relative"
        initial={{ opacity: !hasMounted ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.15,
          ease: "easeInOut",
        }}
      >
        <EditorContent
          editor={editor}
          className="absolute inset-0 overflow-auto focus:outline-none"
        />
      </motion.div>
    </motion.div>
  );
}
