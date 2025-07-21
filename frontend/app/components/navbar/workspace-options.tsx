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
import { redirect, Link, NavLink, useNavigate } from "@remix-run/react";

const WorkspaceOptionsButton = ({
  workspace,
  workspaces,
}: {
  workspace: Workspace;
  workspaces: Workspace[];
}) => {
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="lg" className="px-2">
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
            <SwitchWorkspaceButton workspaces={workspaces} />
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
          <DeleteWorkspaceTrigger workspace={workspace} />

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>
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
      <DeleteWorkspaceDialog workspace={workspace} />
    </Dialog>
  );
};

export default WorkspaceOptionsButton;

const SwitchWorkspaceButton = ({ workspaces }: { workspaces: Workspace[] }) => {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>Switch Workspace</DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          {workspaces
            ? workspaces?.map((ws: Workspace) => (
                <DropdownMenuItem key={ws.id}>
                  <NavLink to={`/${ws.slug}`} className={"w-full"}>
                    {({ isActive }) => (
                      <div className="w-full flex items-center justify-between">
                        <div className={`${isActive ? "font-bold" : ""}`}>
                          {ws.name}
                        </div>
                        <Check
                          className={`w-4 h-4 ${isActive ? "block" : "hidden"}`}
                        />
                      </div>
                    )}
                  </NavLink>
                </DropdownMenuItem>
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

const DeleteWorkspaceTrigger = ({ workspace }: { workspace: Workspace }) => {
  return (
    <DialogTrigger className="text-red-600 dark:text-red-400 flex text-sm gap-x-2 items-center w-full">
      <DropdownMenuItem className="w-full">
        <Trash2 className="w-4 h-4" />
        Delete
      </DropdownMenuItem>
    </DialogTrigger>
  );
};

const DeleteWorkspaceDialog = ({ workspace }: { workspace: Workspace }) => {
  const navigate = useNavigate();
  const handleDelete = () => {
    return navigate(`/api/workspaces/delete/${workspace.id}`);
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
