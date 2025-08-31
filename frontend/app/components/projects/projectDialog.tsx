import { motion } from "framer-motion";
import { useFetcher, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { palette, PaletteKey } from "~/lib/colorList";

import { EmojiPickerPopover } from "./EmojiPicker";
import { useDarkMode } from "~/hooks/useDarkMode";

import type { Project } from "~/types/projects";
import { Separator } from "~/components/ui/separator";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "~/components/ui/select";
import { toast } from "sonner";

import { deleteProjectResponseType } from "~/api/projects";

export type ProjectDialogType = {
  name: string;
  description: string;
  icon: string;
  color: PaletteKey;
};

export type DeleteProjectData = {
  moveNotes: boolean;
  destinationProjectId?: string;
};

export const ProjectDialog = ({
  dialogOpen,
  setDialogOpen,
  originalData,
  newProject,
  projectId,
  projects,
  project,
}: {
  dialogOpen: boolean;
  setDialogOpen: (value: boolean) => void;
  originalData: ProjectDialogType;
  newProject?: boolean;
  projectId?: string;
  projects: Project[];
  project?: Project;
}) => {
  const params = useParams();
  const workspaceSlug = params.workspaceSlug || "";

  // UI Variables
  const isDark = useDarkMode();
  const colors: PaletteKey[] = Object.keys(palette) as PaletteKey[];
  const [iconModalOpen, setIconModalOpen] = useState(false);

  // ----------------------- CREATE & EDIT -----------------------
  const projectFetcher = useFetcher();
  const [initialFormData, setInitialFormData] =
    useState<ProjectDialogType>(originalData);

  const handleUpdateFormData = (item: string, value: any) => {
    const newInitialFormData = { ...initialFormData, [item]: value };
    setInitialFormData(newInitialFormData);
  };

  const handleButtonClick = async () => {
    console.log("this is the formData", initialFormData);
    const formData = new FormData();
    const projectIdForm = projectId || "";
    formData.append("name", initialFormData["name"]);
    formData.append("description", initialFormData["description"]);
    formData.append("icon", initialFormData["icon"]);
    formData.append("color", initialFormData["color"]);
    formData.append("workspaceSlug", workspaceSlug);
    formData.append("projectId", projectIdForm);

    if (newProject) {
      await projectFetcher.submit(formData, {
        method: "POST",
        action: "/api/projects/create",
      });
    } else {
      console.log("Editing the note");
      const result = await projectFetcher.submit(formData, {
        method: "POST",
        action: "/api/projects/edit",
      });
      //   console.log("this is the result", result);
    }
    setDialogOpen(false);
  };

  // ----------------------- DELETE -----------------------
  const deleteProjectFetcher = useFetcher();
  const deleteProjectFetcherData =
    deleteProjectFetcher.data as deleteProjectResponseType;
  const loadingDeleteProject = deleteProjectFetcher.state !== "idle";
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [deleteProjectData, setDeleteProjectData] = useState<DeleteProjectData>(
    {
      moveNotes: false,
      destinationProjectId: projects.find((project) => project.slug === "inbox")
        ?.id,
    }
  );
  const handleDeleteMenu = () => {
    setShowDeleteMenu(true);
  };

  const handleSubmitDeleteProject = async () => {
    const formData = new FormData();
    formData.append("moveNotes", String(deleteProjectData["moveNotes"]));
    formData.append(
      "destinationProjectId",
      deleteProjectData["destinationProjectId"] || ""
    );
    try {
      console.log("submitting form");
      deleteProjectFetcher.submit(formData, {
        method: "DELETE",
        action: `/api/projects/delete/${projectId}`,
      });
    } catch (error) {
      // console.log('Une')
    }
  };

  useEffect(() => {
    console.log("fetcherData", deleteProjectFetcherData);
    if (deleteProjectFetcherData && !deleteProjectFetcherData?.ok) {
      toast.error("Error deleting the project. Please try again.");
    }
    if (deleteProjectFetcherData && deleteProjectFetcherData?.ok) {
      toast.success("Project deleted succesfully.");
      setDialogOpen(false);
    }
  }, [deleteProjectFetcherData]);

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(value) => {
        setShowDeleteMenu(false);
        setDialogOpen(value);
      }}
    >
      <DialogContent
        // style={{
        //   backgroundColor: isDark ? "" : palette[selected].backgroundLight,
        // }}
        onPointerDownOutside={(e) => {
          setShowDeleteMenu(false);
          if (iconModalOpen) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        onEscapeKeyDown={(e) => {
          setShowDeleteMenu(false);
          if (iconModalOpen) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {newProject ? "Create a New Project" : "Edit the Project"}
          </DialogTitle>
          <DialogDescription>
            {newProject ? "Give it your style!" : ""}
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex flex-col gap-y-0">
          <div>
            <Label>Name</Label>
            <div className="flex">
              <EmojiPickerPopover
                isOpen={iconModalOpen}
                setIsOpen={setIconModalOpen}
                onEmojiSelect={(emoji) => {
                  setIconModalOpen(false);
                  // setSelectedIcon(emoji.native);
                  handleUpdateFormData("icon", emoji.native);
                }}
                defaultIcon={originalData.icon}
              />
              <Input
                disabled={project?.slug === "inbox"}
                type="text"
                defaultValue={originalData.name}
                name="name"
                className="w-full"
                autoComplete="off"
                onChange={(e) => {
                  const text = e.target.value;
                  handleUpdateFormData("name", text);
                }}
              />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Input
              type="text"
              defaultValue={originalData.description}
              name="description"
              className=""
              autoComplete="off"
              onChange={(e) => {
                const text = e.target.value;
                handleUpdateFormData("description", text);
              }}
            />
          </div>
          <div>
            <Label>Color</Label>
            <div className="flex gap-3 mt-2">
              {colors.map((name) => (
                <motion.button
                  key={name}
                  type="button"
                  onClick={() => handleUpdateFormData("color", name)}
                  // ${selected === name &&"outline outline-gray-300  dark:outline-gray-800"}
                  className={`w-6 h-6`}
                  initial={false}
                  animate={{
                    borderRadius:
                      initialFormData["color"] === name ? "6px" : "18px",
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
          </div>
        </div>
        <div className="flex flex-col gap-y-0">
          <div className="flex justify-end gap-x-4">
            {!newProject && (
              <div className="flex justify-end items-center gap-x-2">
                {project?.slug === "inbox" && (
                  <div className="text-sm italic text-gray-500">
                    Project Inbox cannot be deleted.
                  </div>
                )}
                <Button
                  onClick={handleDeleteMenu}
                  // style={{
                  //   backgroundColor: isDark ? palette[selected].mainDark : "black",
                  // }}
                  variant="outline"
                  disabled={project?.slug === "inbox"}
                  className="border-red-500 hover:border-red-700 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:border-red-400 dark:hover:text-red-400 dark:hover:bg-red-900/40"
                >
                  Delete
                </Button>
              </div>
            )}
            <Button
              onClick={handleButtonClick}
              // style={{
              //   backgroundColor: isDark ? palette[selected].mainDark : "black",
              // }}
            >
              {newProject ? "Create" : "Save"}
            </Button>
          </div>
          <div
            className={`flex flex-col overflow-hidden m-0 ${
              showDeleteMenu ? "h-[170px] opacity-1 pt-2" : "h-0 opacity-0 py-0"
            } transition-all duration-200 ease-in-out`}
          >
            <div className="font-bold">Confirm Deletion</div>
            <div className="italic text-gray-500 text-sm">
              This action can't be undone.
            </div>

            {/* Move Notes section */}
            <Separator className="my-1" />
            <div className="flex justify-between items-center my-2">
              <div className="flex justify-start items-center gap-x-2 text-sm">
                <Checkbox
                  checked={deleteProjectData.moveNotes}
                  onCheckedChange={(checked) => {
                    const newDeleteProjectData = {
                      ...deleteProjectData,
                      moveNotes: checked as boolean,
                    };
                    setDeleteProjectData(newDeleteProjectData);
                  }}
                />{" "}
                Move projects
              </div>
              <div className="mx-1 ">
                <Select disabled={!deleteProjectData.moveNotes}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Projects" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects
                      .filter((project) => project.id !== projectId)
                      .map((project) => (
                        <SelectItem
                          value={project.id}
                          className="flex items-center gap-y-1"
                        >
                          {project.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator className="my-1" />
            <div className="w-full flex justify-between items-center">
              <div className="text-xs text-gray-500 italic">
                {deleteProjectData.moveNotes
                  ? `Notes will be moved to the selected project.`
                  : "Notes will be deleted as well."}
              </div>
              <Button
                disabled={loadingDeleteProject}
                variant="destructive"
                onClick={handleSubmitDeleteProject}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
