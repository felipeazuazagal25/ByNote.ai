import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, Outlet, redirect } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

import { Button, buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "~/components/ui/checkbox";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowsPointingInIcon,
} from "@heroicons/react/24/outline";

import GridBackground from "~/components/ui/grid-background";
import { parse } from "postcss";

export const meta: MetaFunction = () => {
  return [
    { title: "ByNote" },
    {
      name: "description",
      content: "The AI powered note taking app.",
    },
  ];
};

type Task = {
  id: number;
  title: string;
  completed: boolean;
  type: "section" | "note" | "task";
};

type Note = {
  id: number;
  title: string;
  content: React.ReactNode;
  type: "note";
  expanded: "hidden" | "normal" | "expanded";
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // See if there is a cookie with the access token
  const cookieHeader = request.headers.get("Cookie");
  console.log("[MAIN] cookieHeader", cookieHeader);
  const accessToken = cookieHeader
    ?.split("; ")
    .find((row) => row.startsWith("access_token="))
    ?.split("=")[1];
  console.log("[MAIN] accessToken", accessToken);
  if (accessToken) {
    return redirect("/app");
  }

  return null;
};

const GRID_SIZE = 20;

export default function Index() {
  // Notes with Information
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState<Note[]>(defaultNotes);
  // Task bar with sections
  const [showTaskBar, setShowTaskBar] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Section 1", completed: false, type: "section" },
    { id: 2, title: "Section 2", completed: false, type: "section" },
    { id: 3, title: "Section 3", completed: false, type: "section" },
  ]);

  return (
    <GridBackground>
      {!showNotes ? (
        <motion.div
          key="landing"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className="relative flex flex-col h-screen items-center justify-center"
        >
          <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-900">
            <div className="relative hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <Card className="max-w-md w-full sm:max-w-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-center">
                    ByNote
                  </CardTitle>
                  <CardDescription>
                    Bynote is an AI powered note taking app for your second
                    brain.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <Button
                    variant="default"
                    onClick={() => setShowNotes(true)}
                    className="w-full hover:text-white"
                  >
                    Show me more
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Button>
                  <Separator />
                  <div className="w-full flex justify-between gap-2">
                    <Link
                      to="/login"
                      className={
                        buttonVariants({ variant: "ghost" }) + " w-full"
                      }
                      prefetch="render"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className={
                        buttonVariants({ variant: "outline" }) + " w-full"
                      }
                      prefetch="render"
                    >
                      Sign Up
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="notes"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className="relative w-full mx-auto px-16 h-full"
        >
          <div className="flex flex-col gap-4 h-full min-h-0 py-8">
            <Header />
            <div
              className={`flex h-full min-h-0 transition-all duration-300 ease-in-out ${
                showTaskBar ? "gap-4" : "gap-0"
              }`}
            >
              <TaskBar
                tasks={tasks}
                setTasks={setTasks}
                show={showTaskBar}
                setShow={setShowTaskBar}
              />
              <NoteList
                notes={notes}
                setNotes={setNotes}
                taskbar={{ show: showTaskBar, setShow: setShowTaskBar }}
              />
              <Outlet />
            </div>
          </div>
        </motion.div>
      )}
    </GridBackground>
  );
}

// Header ------------------------------------------------------------
const Header = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="text-2xl font-bold text-center">ByNote</div>
        <div className="flex items-center gap-2">
          <Link to="/login" className={buttonVariants({ variant: "ghost" })}>
            Login
          </Link>
          <Link to="/signup" className={buttonVariants({ variant: "outline" })}>
            Sign Up
          </Link>
        </div>
      </CardHeader>
    </Card>
  );
};

// Task Bar ------------------------------------------------------------
const TaskBar = ({
  tasks,
  setTasks,
  show,
  setShow,
}: {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  show: boolean;
  setShow: (show: boolean) => void;
}) => {
  return (
    <div
      className={`transition-all duration-300 ease-in-out relative ${
        show ? "w-1/5 opacity-100" : "w-0"
      }`}
    >
      <ChevronLeftIcon
        className={`absolute top-4 -left-8 transition-all duration-200 ease-in-out w-6 h-6  bg-white dark:bg-gray-900 outline outline-1 outline-gray-200 dark:outline-gray-800 rounded-full p-1 ${
          show ? "rotate-180" : ""
        }`}
        onClick={() => setShow(!show)}
      />
      <div
        className={`transition-all duration-300 ease-in-out ${
          show ? "w-full opacity-100" : "opacity-0"
        }`}
      >
        <Card
          className={`transition-all duration-300 ease-in-out min-w-full  ${
            show ? "opacity-100 hover:shadow-xl" : "opacity-0"
          }`}
        >
          <CardHeader>
            <CardTitle className="text-xl font-bold flex flex-row">
              <div>Sections</div>
              <div>{/* Icon to toggle open and close */}</div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-y-10">
              {tasks.map((task) => (
                <div
                  className="flex items-center gap-x-4 text-nowrap"
                  key={task.id}
                >
                  <motion.div
                    animate={{
                      scale: task.completed ? 1.1 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => {
                        setTasks(
                          tasks.map((t) =>
                            t.id === task.id
                              ? { ...t, completed: !t.completed }
                              : t
                          )
                        );
                      }}
                    />
                  </motion.div>

                  <div className="relative">
                    <span
                      className={`transition-colors overflow-hidden ${
                        task.completed ? "text-gray-500" : ""
                      }`}
                    >
                      {task.title}
                    </span>
                    {/* Animated strikethrough line */}
                    <motion.div
                      layout
                      initial={false}
                      animate={{
                        width: task.completed ? "100%" : "0%",
                        opacity: task.completed ? 1 : 0,
                      }}
                      transition={{ duration: 0.15, ease: "easeInOut" }}
                      className="absolute left-0 top-1/2 h-0.5 bg-gray-400 rounded pointer-events-none"
                      style={{ right: 0 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Notes ------------------------------------------------------------
const Note = ({
  note,
  notes,
  setNotes,
  taskbar,
}: {
  note: Note;
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  taskbar: { show: boolean; setShow: (show: boolean) => void };
}) => {
  const { show, setShow } = taskbar;
  return (
    <div
      className={`group transition-all duration-300 ease-in-out ${
        note.expanded === "hidden"
          ? "h-0 opacity-0 min-h-0 pointer-events-none mb-0"
          : note.expanded === "normal"
          ? "h-40 opacity-100 hover:h-52 py-0 pr-0 mb-4"
          : `flex-1 opacity-100 w-full`
      }`}
    >
      <Card className="h-full">
        <CardContent
          className={`h-full transition-all duration-300 ease-in-out ${
            note.expanded === "normal"
              ? "flex flex-col space-y-4 items-center justify-center pt-6"
              : note.expanded === "expanded"
              ? "flex flex-col space-y-4 items-start justify-start p-16"
              : ""
          }`}
        >
          <CardTitle
            className={`flex flex-row w-full transition-all duration-300 ease-in-out  ${
              note.expanded === "expanded"
                ? "justify-between"
                : "justify-center"
            }`}
          >
            <div className="text-lg font-bold">{note.title}</div>
            {note.expanded === "expanded" && (
              <div>
                <Button
                  variant="ghost"
                  className="text-gray-500 transition-all duration-200 ease-in-out "
                  onClick={() => {
                    setShow(true);
                    setNotes(notes.map((n) => ({ ...n, expanded: "normal" })));
                  }}
                >
                  Press <span className="font-bold">esc</span> or{" "}
                  <ArrowsPointingInIcon className="w-6 h-6" />
                </Button>
              </div>
            )}
          </CardTitle>
          <div className="focus:outline-none prose dark:prose-invert">
            {note.content}
          </div>
          <Button
            variant="ghost"
            className={`text-gray-500 scale-0 transition-all duration-200 ease-in-out ${
              note.expanded === "normal" && "group-hover:scale-100"
            }`}
            onClick={() => {
              setShow(false);
              setNotes(
                notes.map((n) =>
                  n.id === note.id
                    ? { ...n, expanded: "expanded" }
                    : { ...n, expanded: "hidden" }
                )
              );
            }}
          >
            <div className="flex flex-col gap-x-2">Click here to expand</div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const defaultNotes: Note[] = [
  {
    id: 1,
    title: "What is ByNote?",
    content: "ByNote is an AI powered note taking app for your second brain.",
    type: "note",
    expanded: "normal",
  },
  {
    id: 2,
    title: "How to use ByNote?",
    content:
      "ByNote is easy to use. Just click on the note you want to expand and it will expand.",
    type: "note",
    expanded: "normal",
  },
  {
    id: 3,
    title: "Pricing",
    content:
      "ByNote is free to use. You can upgrade to a paid plan to get more features.",
    type: "note",
    expanded: "normal",
  },
];

const NoteList = ({
  notes,
  setNotes,
  taskbar,
}: {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  taskbar: { show: boolean; setShow: (show: boolean) => void };
}) => {
  const { show, setShow } = taskbar;
  return (
    <div
      className={`flex flex-col h-full min-h-0 transition-all duration-300 ease-in-out ${
        show ? "w-4/5" : "w-full"
      }`}
    >
      {notes.map((note) => (
        <Note
          key={note.id}
          note={note}
          taskbar={taskbar}
          notes={notes}
          setNotes={setNotes}
        />
      ))}
    </div>
  );
};
