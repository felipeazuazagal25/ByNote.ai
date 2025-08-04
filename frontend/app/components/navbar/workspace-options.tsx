import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "../ui/button";
import {
  ChevronsUpDown,
  Check,
  Pen,
  SquarePlus,
  Rows3,
  Trash2,
  Archive,
} from "lucide-react";
import { Workspace } from "~/types/workspaces";
import { Link, NavLink, useNavigate, Form, useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useNavigation } from "@remix-run/react";
import { ActionFunction, redirect } from "@remix-run/node";

const WorkspaceOptionsButton = ({
  workspace,
  workspaces,
}: {
  workspace: Workspace;
  workspaces: Workspace[];
}) => {
  const [dropdownMenuOpen, setDropdownMenuOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  return (
    <>
      <DropdownMenu open={dropdownMenuOpen} onOpenChange={setDropdownMenuOpen}>
        <DropdownMenuTrigger>
          <Button
            variant="outline"
            size="lg"
            className="px-2"
            onClick={() => {
              setDropdownMenuOpen(!dropdownMenuOpen);
            }}
          >
            <div className="flex justify-between items-center w-full gap-x-2">
              <div>{workspace.name}</div>{" "}
              <div className="ml-2">
                <ChevronsUpDown />
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="text-gray-600 dark:text-gray-400"
          align="start"
        >
          <DropdownMenuLabel>Workspace</DropdownMenuLabel>
          <DropdownMenuGroup>
            <SwitchWorkspaceButton
              workspaces={workspaces}
              onCloseDropdownMenu={() => setDropdownMenuOpen(false)}
            />
            <DropdownMenuItem>
              <Pen />
              Edit Workspace
              {/* <DropdownMenuShortcut>⌘B</DropdownMenuShortcut> */}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuItem className="">
            <Archive />
            Archive
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setDeleteDialogOpen(true);
            }}
            className="text-red-600 dark:text-red-400 "
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                setCreateDialogOpen(true);
              }}
            >
              <SquarePlus />
              Create Workspace
            </DropdownMenuItem>
            <Link to={"/workspaces/all"}>
              <DropdownMenuItem>
                <Rows3 />
                Manage Workspaces
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DeleteWorkspaceDialog
          workspace={workspace}
          onCloseDialog={() => setDeleteDialogOpen(false)}
          onCloseDropdownMenu={() => setDropdownMenuOpen(false)}
        />
      </Dialog>
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <CreateWorkspaceDialog
          onCloseDialog={() => setCreateDialogOpen(false)}
          onCloseDropdownMenu={() => setDropdownMenuOpen(false)}
        />
      </Dialog>
    </>
  );
};

export default WorkspaceOptionsButton;

const SwitchWorkspaceButton = ({
  workspaces,
  onCloseDropdownMenu,
}: {
  workspaces: Workspace[];
  onCloseDropdownMenu: () => void;
}) => {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>Switch Workspace</DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          {workspaces
            ? workspaces?.map((ws: Workspace) => (
                <NavLink
                  to={`/${ws.slug}`}
                  className={"w-full"}
                  onClick={onCloseDropdownMenu}
                >
                  {({ isActive }) => (
                    <DropdownMenuItem key={ws.id}>
                      <div className="w-full flex items-center justify-between">
                        <div className={`${isActive ? "font-bold" : ""}`}>
                          {ws.name}
                        </div>
                        <Check
                          className={`w-4 h-4 ${isActive ? "block" : "hidden"}`}
                        />
                      </div>
                    </DropdownMenuItem>
                  )}
                </NavLink>
              ))
            : ""}
          <DropdownMenuSeparator />
          <Link to={"/workspaces/all"}>
            <DropdownMenuItem>Show all...</DropdownMenuItem>
          </Link>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};

const DeleteWorkspaceDialog = ({
  workspace,
  onCloseDialog,
  onCloseDropdownMenu,
}: {
  workspace: Workspace;
  onCloseDialog: () => void;
  onCloseDropdownMenu: () => void;
}) => {
  const fetcher = useFetcher();
  const handleDelete = () => {
    onCloseDialog();
    onCloseDropdownMenu();
    return fetcher.submit(null, {
      method: "delete",
      action: `/api/workspaces/delete/${workspace.id}`,
    });
  };
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Deleting Workspace "{workspace.name}"</DialogTitle>
      </DialogHeader>
      <div className="text-sm text-gray-500">
        This action cannot be undone. This will permanently delete this
        workspace and remove your data from our servers.
      </div>
      <DialogFooter className="flex justify-end items-center">
        {workspace.slug === "personal" && (
          <div className="text-sm italic text-gray-500">
            You cannot delete your personal workspace.
          </div>
        )}
        <Button
          type="submit"
          variant="destructive"
          disabled={workspace.slug === "personal"}
          onClick={handleDelete}
        >
          Delete
          <Trash2 />
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

const CreateWorkspaceDialog = ({
  onCloseDialog,
  onCloseDropdownMenu,
}: {
  onCloseDialog: () => void;
  onCloseDropdownMenu: () => void;
}) => {
  const navigate = useNavigate();
  const createWorkspaceFetcher = useFetcher();
  const isSubmitting = createWorkspaceFetcher.state === "submitting";
  const fetcherData = createWorkspaceFetcher.data as
    | { error?: string; success?: boolean; slug?: string }
    | undefined;

  useEffect(() => {
    if (fetcherData?.success) {
      onCloseDialog();
      onCloseDropdownMenu();
      navigate(`/${fetcherData.slug}`);
    }
  }, [fetcherData]);

  return (
    <DialogContent>
      <createWorkspaceFetcher.Form
        method="post"
        action="/api/workspaces/create"
      >
        <DialogHeader>
          <DialogTitle>Create a new workspace</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-gray-500">Fill out the information.</div>
        <DialogDescription className="flex flex-col gap-y-2 my-4">
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
          {fetcherData?.error && (
            <div className="text-sm text-red-500">{fetcherData.error}</div>
          )}
        </DialogDescription>
        <DialogFooter className="flex justify-end items-center">
          <Button>{isSubmitting ? "Creating..." : "Create"}</Button>
        </DialogFooter>
      </createWorkspaceFetcher.Form>
    </DialogContent>
  );
};
