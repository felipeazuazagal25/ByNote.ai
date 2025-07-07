import {
  Link,
  Outlet,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import GridBackground from "~/components/ui/grid-background";
import { getProjects } from "../api/projects";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Button, buttonVariants } from "~/components/ui/button";
import { getCurrentUser } from "../api/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { CreateNoteShortcuts, CreateProjectShortcuts } from "~/utils/shortcuts";
import ButtonWithShortcut from "~/components/ui/button-shortchut";
import { getWorkspace } from "../api/workspaces";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MenuIcon } from "lucide-react";

const DEBUG = process.env.NODE_ENV === "development";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getCurrentUser(request);
  const defaultWorkspaceId = user.default_workspace_id;

  // Identify the page to load
  const url = new URL(request.url).pathname;
  if (url === "/app") {
    // Default behavior when user is logged in
    const workspace = await getWorkspace(request, defaultWorkspaceId);
    if (DEBUG) console.log("workspace", workspace);
    return new Response(JSON.stringify({ loadDefaultApp: true, workspace }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    return { loadDefaultApp: false, workspace: null };
  }
};

const Layout = () => {
  const loaderData = useLoaderData<LoaderFunctionArgs>();
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    console.log("this is loaderData", loaderData);
  }, []);

  const { loadDefaultApp, workspace } = useLoaderData<typeof loader>();
  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 flex flex-col">
      <Navbar
        workspace={workspace}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
      />
      <div className="w-full flex-1 flex ">
        <AppSidebar
          open={showSidebar}
          setOpen={setShowSidebar}
          workspace={workspace}
        />
        {loadDefaultApp ? <DefaultApp /> : <Outlet />}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;

const DefaultApp = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <h1>Default App</h1>
    </div>
  );
};

const Navbar = ({
  workspace,
  showSidebar,
  setShowSidebar,
}: {
  workspace: any;
  showSidebar: boolean;
  setShowSidebar: (showSidebar: boolean) => void;
}) => {
  return (
    <div className="w-full py-2 px-5 z-10">
      <Card className="h-16 w-full flex justify-between items-center my-auto px-2">
        <Button
          onClick={() => setShowSidebar(!showSidebar)}
          variant="ghost"
          size="icon"
          className=""
        >
          <MenuIcon className="w-4 h-4" />
        </Button>
        <div className="">Workspace: {workspace.name}</div>
      </Card>
    </div>
  );
};

const AppSidebar = ({
  open,
  setOpen,
  workspace,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  workspace: any;
}) => {
  return (
    <motion.div
      className="flex flex-col px-5 z-10"
      animate={{
        width: open ? "30%" : "0px",
        minWidth: open ? "16rem" : "0px",
        maxWidth: open ? "20rem" : "0px",
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
                onClick={() => {
                  console.log("Creating New Note...");
                }}
              >
                New Note
              </ButtonWithShortcut>
              <ButtonWithShortcut
                shortcuts={CreateProjectShortcuts}
                OS="macOS"
                variant="outline"
                onClick={() => {
                  console.log("Creating New Project...");
                }}
              >
                New Project
              </ButtonWithShortcut>
            </div>
          </CardHeader>
          <CardContent className="flex-1 ">
            <CardDescription>
              <div className="text-xs text-gray-500 font-serif">
                Your Content
              </div>
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

const Footer = () => {
  return (
    <div className="w-full py-2 px-5 z-10">
      <Card className="h-20 w-full">
        <CardHeader>This is the footer</CardHeader>
      </Card>
    </div>
  );
};

// const ButtonWithShortcut = ({
//   OS,
//   shortcuts,
//   children,
// }: {
//   OS: string;
//   shortcuts: Shorcut[];
//   children: React.ReactNode;
// }) => {
//   return (
//     <Button className="w-full relative" size="sm">
//       <div>Create Note</div>{" "}
//       <div className="absolute rounded-full px-2 py-1 text-right right-1 text-gray-400 font-sans">
//         {/* Add shortcut depending on the system */}
//         {OS === "macOS" ? "⌘N" : "Ctrl+N"}
//       </div>{" "}
//     </Button>
//   );
// };

// const CreateNoteButton = ({ OS }: { OS: string }) => {
//   return (
//     <Button className="w-full relative" size="sm">
//       <div>Create Note</div>{" "}
//       <div className="absolute rounded-full px-2 py-1 text-right right-1 text-gray-400 font-sans">
//         {/* Add shortcut depending on the system */}
//         {OS === "macOS" ? "⌘N" : "Ctrl+N"}
//       </div>{" "}
//     </Button>
//   );
// };
