import { Card } from "~/components/ui/card";
import { Button } from "../ui/button";
import { MenuIcon } from "lucide-react";
import { Workspace } from "~/types/workspaces";
import WorkspaceOptionsButton from "./workspace-options";
import AccountOptionsButtons from "./account-options";

// import { IconCreditCard } from "@tabler/icons-react";

const Navbar = ({
  workspace,
  workspaces,
  userInfo,
  showSidebar,
  setShowSidebar,
}: {
  workspace: Workspace;
  workspaces: Workspace[];
  userInfo: any;
  showSidebar: boolean;
  setShowSidebar: (showSidebar: boolean) => void;
}) => {
  return (
    <div className="w-full py-2 px-5 z-10">
      <Card className="h-16 w-full flex justify-between items-center my-auto px-2 gap-x-2 dark:bg-dark-bg">
        {/* First section */}
        <div className="flex items-center gap-x-2">
          <Button
            onClick={() => setShowSidebar(!showSidebar)}
            variant="ghost"
            size="icon"
            className=""
          >
            <MenuIcon className="w-4 h-4" />
          </Button>
          <WorkspaceOptionsButton
            workspace={workspace}
            workspaces={workspaces}
          />
        </div>
        <AccountOptionsButtons userInfo={userInfo} />
        {/* <div className="">Workspace: {workspace.name}</div> */}
      </Card>
    </div>
  );
};

export default Navbar;
