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
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const AppSidebar = ({
  open = true,
  setOpen,
  workspace,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  workspace: any;
}) => {
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
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
                  setProjectDialogOpen(true);
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
      <ProjectDialog
        dialogOpen={projectDialogOpen}
        setDialogOpen={setProjectDialogOpen}
      />
    </motion.div>
  );
};

export default AppSidebar;

const ProjectDialog = ({
  dialogOpen,
  setDialogOpen,
}: {
  dialogOpen: boolean;
  setDialogOpen: (value: boolean) => void;
}) => {
  const projectFetcher = useFetcher();
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <projectFetcher.Form method="post" action={`projects/create`}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              This dialog is for creating a note
            </DialogDescription>
          </DialogHeader>
          <div className="w-full flex flex-col gap-y-4 ">
            <div>
              <Label>Name</Label>
              <Input
                type="text"
                placeholder=""
                name="name"
                className=""
                autoComplete="off"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                type="text"
                placeholder=""
                name="description"
                className=""
                autoComplete="off"
              />
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button type="submit">Create</Button>
        </DialogFooter>
      </projectFetcher.Form>
    </Dialog>
  );
};
