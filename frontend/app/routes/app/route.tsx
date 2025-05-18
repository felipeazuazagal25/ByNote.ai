import { Link, Outlet, useLoaderData } from "@remix-run/react";
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
  const { loadDefaultApp, workspace } = useLoaderData<typeof loader>();
  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 flex flex-col">
      <Navbar workspace={workspace} />
      <div className="w-full flex-1 flex ">
        <AppSidebar />
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

const Navbar = ({ workspace }: { workspace: any }) => {
  return (
    <div className="w-full py-5 px-5">
      <Card className="h-16 w-full flex justify-between items-center">
        Workspace: {workspace.name}
      </Card>
    </div>
  );
};

const AppSidebar = () => {
  return (
    <div className="w-[30%] flex flex-col px-5 z-10">
      <Card className="flex-1 w-full flex flex-col ">
        <CardHeader>
          <ButtonWithShortcut
            shortcuts={CreateNoteShortcuts}
            OS="macOS"
            variant="default"
          >
            New Note
          </ButtonWithShortcut>
          <ButtonWithShortcut
            shortcuts={CreateProjectShortcuts}
            OS="macOS"
            variant="outline"
          >
            New Project
          </ButtonWithShortcut>
        </CardHeader>
        <CardContent className="flex-1 ">
          <CardDescription>Sidebar</CardDescription>
        </CardContent>
        <CardFooter>
          <Link to="/logout" className={buttonVariants({ variant: "outline" })}>
            Logout
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

const Footer = () => {
  return (
    <div className="w-full  py-5 px-5 z-10">
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
