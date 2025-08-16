import { Outlet, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getCurrentUser } from "../../api/auth";
import { Card, CardHeader } from "~/components/ui/card";
import {
  getWorkspaces,
  getWorkspace,
  getWorkspaceBySlug,
} from "../../api/workspaces";
import { useEffect, useState } from "react";
import AppSidebar from "~/components/sidebar/Sidebar";
import Navbar from "~/components/navbar/navbar";

const DEBUG = process.env.NODE_ENV === "development";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const workspaces = await getWorkspaces(request);
  const { workspaceSlug, projectSlug } = params; // Get the strings of parameters
  // console.log("This is projectSlug", projectSlug);
  const { pathname, searchParams } = new URL(request.url);

  const user = await getCurrentUser(request);
  const {
    id,
    default_workspace_id,
    default_project_id,
    is_active,
    is_superuser,
    is_verified,
    ...userInfo
  } = user;
  const defaultWorkspaceId = user.default_workspace_id;
  console.log("this is the pathname", pathname);

  // Identify the page to load
  if (pathname === "/") {
    // Default behavior when user is logged in
    const workspace = await getWorkspace(request, defaultWorkspaceId);
    if (DEBUG) console.log("workspace", workspace);
    return new Response(
      JSON.stringify({ loadDefaultApp: true, workspace, workspaces, userInfo }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } else if (workspaceSlug) {
    try {
      const workspace = await getWorkspaceBySlug(request, workspaceSlug);
      const loadDefaultApp = pathname === `/${workspace.slug}`; // Load default app of another workspace
      if (DEBUG) console.log("projectSlug", projectSlug);
      return new Response(
        JSON.stringify({ loadDefaultApp, workspace, workspaces, userInfo }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.log(error);
      const workspace = await getWorkspace(request, defaultWorkspaceId);
      return redirect(`/${workspace.slug}`);
    }
  } else {
    return { loadDefaultApp: false, workspace: null, userInfo };
  }
};

const Layout = () => {
  const loaderData = useLoaderData<LoaderFunctionArgs>();
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    console.log("this is loaderData", loaderData);
  }, []);

  const { loadDefaultApp, workspace, workspaces, userInfo } =
    useLoaderData<typeof loader>();
  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 flex flex-col h-screen">
      <Navbar
        workspace={workspace}
        workspaces={workspaces}
        userInfo={userInfo}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
      />
      <div className="w-full flex-1 flex h-full">
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

const Footer = () => {
  return (
    <div className="py-2 px-5 z-10">
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
