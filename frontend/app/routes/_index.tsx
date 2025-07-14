import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getCurrentUser } from "./api/auth";
import { UserInfo } from "~/types/userInfo";
import { getWorkspace } from "./api/workspaces";
import { Workspace } from "~/types/workspaces";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user: UserInfo = await getCurrentUser(request);
  const workspace: Workspace = await getWorkspace(
    request,
    user.default_workspace_id
  );
  if (workspace) {
    return redirect(`${workspace.id}`);
  } else {
    return new Error("Server error, please try again.");
  }
  console.log("NEW ONE", workspace);
  return 0;
};

const Temp = () => {
  return <div>temp</div>;
};

export default Temp;
