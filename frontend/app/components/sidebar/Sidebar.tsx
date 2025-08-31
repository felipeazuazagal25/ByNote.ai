import { motion } from "framer-motion";
import { Link, useFetcher, useParams } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import ButtonWithShortcut from "~/components/ui/button-shortchut";
import { CreateNoteShortcuts, CreateProjectShortcuts } from "~/utils/shortcuts";
import { buttonVariants } from "../ui/button";
import { useEffect, useState } from "react";

import { ProjectNotes } from "./ProjectNotes";
import type { Project } from "~/types/projects";

import { ProjectDialog } from "../projects/projectDialog";

const AppSidebar = ({
  open = true,
  setOpen,
  workspace,
  projects,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  workspace: any;
  projects: Project[];
}) => {
  const params = useParams();
  const projectSlug = params.projectSlug;
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [iconModalOpen, setIconModalOpen] = useState(false);
  const noteFetcher = useFetcher();
  const noteFetcherData = noteFetcher.data;
  const noteIsSubmitting = noteFetcher.state === "submitting";
  const handleCreateNote = () => {
    console.log("creating the note...");
    const formData = {
      title: "New Note",
      text_content: "",
      rich_content: JSON.stringify({}),
      workspaceSlug: workspace.slug,
      projectSlug: projectSlug || "",
    };
    noteFetcher.submit(formData, {
      method: "post",
      action: `/api/notes/create`,
    });
  };

  useEffect(() => {
    console.log("this is fetcher data", noteFetcherData);
  }, [noteFetcherData]);

  return (
    <motion.div
      initial={false}
      className="flex flex-col pl-5 pr-[10px] z-10"
      animate={{
        width: open ? "30%" : "0px",
        minWidth: open ? "16rem" : "0px",
        maxWidth: open ? "20rem" : "0px",
        paddingRight: open ? "10px" : "0px",
      }}
      transition={{
        duration: open ? 0.1 : 0.2,
        ease: "easeInOut",
      }}
    >
      <motion.div
        className="flex-1 w-full flex flex-col"
        animate={{ opacity: open ? 1 : 0 }}
        transition={{
          duration: open ? 0.2 : 0.1,
          ease: "easeInOut",
        }}
      >
        <Card className="flex-1 w-full flex flex-col text-nowrap bg-white dark:bg-black h-full min-h-0 relative">
          <CardHeader>
            <div className="flex flex-col gap-2">
              <ButtonWithShortcut
                shortcuts={CreateNoteShortcuts}
                OS="macOS"
                variant="default"
                onClick={handleCreateNote}
                submiting={noteIsSubmitting}
              >
                {noteIsSubmitting ? "Creating..." : "New Note"}
              </ButtonWithShortcut>

              <ButtonWithShortcut
                shortcuts={CreateProjectShortcuts}
                OS="macOS"
                variant="outline"
                onClick={() => {
                  setProjectDialogOpen(true);
                }}
                submiting={false}
              >
                New Project
              </ButtonWithShortcut>
            </div>
          </CardHeader>
          <div className="text-sm text-gray-500 font-serif py-1 px-7 flex justify-between items-center">
            <div>Your Projects</div>{" "}
            <Link
              to={`/${workspace.slug}/projects`}
              className={`text-xs h-4 italic text-gray-400 dark:text-gray-600`}
            >
              See all
            </Link>
          </div>
          <CardContent className="flex-1 h-full flex flex-col relative min-h-0">
            <div className="overflow-auto h-full absolute top-0 inset-0 px-7">
              {projects
                .sort((a, b) => {
                  return (
                    new Date(b.updated_at).getTime() -
                    new Date(a.updated_at).getTime()
                  );
                })
                .map((project) => (
                  <ProjectNotes project={project} workspace={workspace} />
                ))}
            </div>

            {/* <ProjectGroup
                categoryName={"Projects"}
                objects={workspace.topNProjects}
                icon={<FolderClosed className="w-5 h-5" />}
                showAllLink={`/${workspace.slug}/projects`}
              />
              <NoteGroup
                categoryName={"Notes"}
                objects={workspace.topNNotes}
                icon={<StickyNote className="w-5 h-5" />}
                showAllLink={`/${workspace.slug}/notes`}
              /> */}
          </CardContent>
          <CardFooter>
            <Link
              to="/logout"
              className={buttonVariants({ variant: "outline" })}
            >
              Logout
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
      <ProjectDialog
        dialogOpen={projectDialogOpen}
        setDialogOpen={setProjectDialogOpen}
        projects={projects}
        originalData={{
          name: "",
          description: "",
          icon: "📚",
          color: "bw",
        }}
        newProject={true}
      />
    </motion.div>
  );
};

export default AppSidebar;
