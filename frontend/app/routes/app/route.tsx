import { Link, Outlet, useLoaderData } from "@remix-run/react";
import GridBackground from "~/components/ui/grid-background";
import { getProjects } from "../api/projects";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { buttonVariants } from "~/components/ui/button";
import { getCurrentUser } from "../api/auth";

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
    <GridBackground>
      <div className="relative flex min-h-screen items-center justify-center">
        <div>
          <Link to="/logout" className={buttonVariants({ variant: "outline" })}>
            Logout
          </Link>
        </div>
        <div className="w-full h-full flex justify-center items-center">
          {loadDefaultApp ? <DefaultApp /> : <Outlet />}
        </div>
      </div>
    </GridBackground>
  );
};

export default Layout;

const DefaultApp = () => {
  return (
    <div className="w-full h-ful l flex justify-center items-center">
      <h1>Default App</h1>
    </div>
  );
};
