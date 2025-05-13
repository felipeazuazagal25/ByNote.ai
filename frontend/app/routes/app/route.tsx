import { Link, Outlet, useLoaderData } from "@remix-run/react";
import GridBackground from "~/components/ui/grid-background";
import { getProjects } from "../api/projects";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { buttonVariants } from "~/components/ui/button";
import { getCurrentUser } from "../api/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarProvider,
} from "~/components/ui/sidebar";

const DEBUG = process.env.NODE_ENV === "development";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const accessToken = cookieHeader
    ?.split("; ")
    .find((row) => row.startsWith("access_token="))
    ?.split("=")[1];

  if (DEBUG)
    console.log("[API] PROJECTS - getProjects() - accessToken", accessToken);
  if (!accessToken) {
    return redirect("/");
  }
  // Getting user data and checking is it was verified, redirecting to verify page if not
  const user = await getCurrentUser(request);
  console.log("user", user);
  if (!user.is_verified) {
    return redirect("/verify");
  }

  // Identify the page to load
  const url = new URL(request.url).pathname;
  if (url === "/app") {
    // Default behavior when user is logged in
    const projects = await getProjects(request);
    if (DEBUG) console.log("projects", projects);
    return new Response(JSON.stringify({ loadDefaultApp: true, projects }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    return { loadDefaultApp: false, projects: null };
  }
};

const Layout = () => {
  const { loadDefaultApp, projects } = useLoaderData<typeof loader>();
  return (
    <SidebarProvider>
      <GridBackground>
        <div className="relative flex min-h-screen items-center justify-center">
          <div className="w-full h-full flex justify-center items-center">
            <AppSidebar />
            {loadDefaultApp ? <DefaultApp /> : <Outlet />}
          </div>
        </div>
      </GridBackground>
    </SidebarProvider>
  );
};

export default Layout;

const DefaultApp = () => {
  return (
    <div className="w-full h-ful l flex justify-center items-center">
      <h1>Default App</h1>
      <Link to="/logout" className={buttonVariants({ variant: "outline" })}>
        Logout
      </Link>
    </div>
  );
};

const AppSidebar = () => {
  return (
    <Sidebar className="h-full bg-gray-50 dark:bg-red-600">
      <SidebarHeader />
      <SidebarContent className="bg-gray-50 dark:bg-gray-900">
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <Link to="/projects">Projects</Link>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};
