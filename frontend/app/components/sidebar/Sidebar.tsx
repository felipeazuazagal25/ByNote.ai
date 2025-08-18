import { motion } from "framer-motion";
import { Link, useFetcher, useParams } from "@remix-run/react";
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
import { palette, PaletteKey } from "~/lib/colorList";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { lazy, Suspense } from "react";

import { EmojiPickerPopover } from "./EmojiPicker";
import { useDarkMode } from "~/hooks/useDarkMode";

import { Form } from "@remix-run/react";

import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
} from "~/components/ui/emoji-picker";
import { Workspace } from "~/types/workspaces";
import { Project } from "~/types/projects";

const AppSidebar = ({
  open = true,
  setOpen,
  workspace,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  workspace: any;
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
  const params = useParams();
  const workspaceSlug = params.workspaceSlug || "";
  const projectFetcher = useFetcher();
  const isDark = useDarkMode();
  const [selected, setSelected] = useState<PaletteKey>("bw");
  const [selectedIcon, setSelectedIcon] = useState("📚");
  const colors: PaletteKey[] = Object.keys(palette) as PaletteKey[];
  // const hexSelectedLight = palette[selected].mainLight;
  // const hexSelectedLightBackground = palette[selected].backgroundLight;
  // const hexSelectedDark = palette[selected].mainDark;
  // const hexSelectedDarkBackground = palette[selected].backgroundDark;
  const [iconModalOpen, setIconModalOpen] = useState(false);

  // useEffect(() => {
  //   console.log("this is the projectfetcherdata", projectFetcherData);
  //   console.log("this is the projectfetcher state", projectFetcherState);
  // }, [projectFetcherData, projectFetcherState]);
  const handleButtonClick = async () => {
    const formData = new FormData();
    formData.append(
      "name",
      document.querySelector<HTMLInputElement>('input[name="name"]')?.value ||
        ""
    );
    formData.append(
      "description",
      document.querySelector<HTMLInputElement>('input[name="description"]')
        ?.value || ""
    );
    formData.append("icon", selectedIcon);
    formData.append("color", selected);
    formData.append("workspaceSlug", workspaceSlug);

    await projectFetcher.submit(formData, {
      method: "POST",
      action: "/api/projects/create",
    });

    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Form
        method="post"
        action="/api/projects/create"
        // onSubmit={(event) => {
        //   event.preventDefault();
        //   const form = event.currentTarget;
        //   const formData = new FormData(form);

        //   projectFetcher.submit(formData, {
        //     method: "POST",
        //     action: "/api/projects/create",
        //   });
        // }}
      >
        <DialogContent
          // style={{
          //   backgroundColor: isDark ? "" : palette[selected].backgroundLight,
          // }}
          onPointerDownOutside={(e) => {
            if (iconModalOpen) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          onEscapeKeyDown={(e) => {
            if (iconModalOpen) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>Give it your style!</DialogDescription>
          </DialogHeader>
          <div className="w-full flex flex-col gap-y-4">
            <div>
              <Label>Name</Label>
              <div className="flex">
                <EmojiPickerPopover
                  isOpen={iconModalOpen}
                  setIsOpen={setIconModalOpen}
                  onEmojiSelect={(emoji) => {
                    setIconModalOpen(false);
                    setSelectedIcon(emoji.native);
                  }}
                />
                <input type="hidden" name="icon" value={selectedIcon} />
                <Input
                  type="text"
                  placeholder=""
                  name="name"
                  className="w-full"
                  autoComplete="off"
                />
              </div>
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
            <div>
              <Label>Color</Label>
              <div className="flex gap-3 mt-2">
                {colors.map((name) => (
                  <motion.button
                    key={name}
                    type="button"
                    onClick={() => setSelected(name)}
                    // ${selected === name &&"outline outline-gray-300  dark:outline-gray-800"}
                    className={`w-6 h-6`}
                    initial={false}
                    animate={{
                      borderRadius: selected === name ? "6px" : "18px",
                    }}
                    transition={{
                      duration: 0.15,
                      ease: "easeInOut",
                    }}
                    style={{
                      backgroundColor: isDark
                        ? palette[name].mainDark
                        : palette[name].mainLight,
                    }}
                  />
                ))}
              </div>
              <input type="hidden" name="color" value={selected} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleButtonClick}
              // style={{
              //   backgroundColor: isDark ? palette[selected].mainDark : "black",
              // }}
            >
              Create
            </Button>
          </div>
        </DialogContent>
      </Form>
    </Dialog>
  );
};
