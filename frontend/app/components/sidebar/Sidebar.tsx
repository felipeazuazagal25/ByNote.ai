import { motion } from "framer-motion";
import { Link, useFetcher } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { ObjectGroup } from "~/components/sidebar/ObjectGroup";
import ButtonWithShortcut from "~/components/ui/button-shortchut";
import { CreateNoteShortcuts, CreateProjectShortcuts } from "~/utils/shortcuts";
import { FolderClosed, StickyNote } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { useEffect } from "react";

const AppSidebar = ({
  open = true,
  setOpen,
  workspace,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  workspace: any;
}) => {
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
        <Card className="flex-1 w-full flex flex-col text-nowrap bg-white dark:bg-black">
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
                  console.log("Creating New Project...");
                }}
                submiting={false}
              >
                New Project
              </ButtonWithShortcut>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <CardDescription>
              <div className="text-xs text-gray-500 font-serif">
                Your Content
              </div>
              <ObjectGroup
                categoryName={"Projects"}
                objects={workspace.topNProjects}
                icon={<FolderClosed className="w-5 h-5" />}
                showAllLink={`/${workspace.slug}/projects`}
              />
              <ObjectGroup
                categoryName={"Notes"}
                objects={workspace.topNNotes}
                icon={<StickyNote className="w-5 h-5" />}
                showAllLink={`/${workspace.slug}/notes`}
              />
            </CardDescription>
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
    </motion.div>
  );
};

export default AppSidebar;
