import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getCurrentUser } from "../api/auth";
import { UserInfo } from "~/types/userInfo";
import { getWorkspace } from "../api/workspaces";
import { Workspace } from "~/types/workspaces";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user: UserInfo = await getCurrentUser(request, "landing-page");
  const workspace: Workspace = await getWorkspace(
    request,
    user.default_workspace_id
  );
  if (workspace) {
    return redirect(`${workspace.slug}`);
  } else {
    return new Error("Server error, please try again.");
  }
};

const Redirect = () => {
  return <div>redirecting...</div>;
};

export default Redirect;
