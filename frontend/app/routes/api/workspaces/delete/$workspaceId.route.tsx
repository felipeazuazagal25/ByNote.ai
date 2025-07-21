import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getCurrentUser } from "~/api/auth";
import { deleteWorkspace } from "~/api/workspaces";
import { UserInfo } from "~/types/userInfo";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const user: UserInfo = await getCurrentUser(request);
  console.log("these are the params for this endpoint", params);
  const workspaceId = params.workspaceId || "";
  if (!workspaceId) {
    return redirect(`/`);
  }
  await deleteWorkspace(request, workspaceId);
  return redirect(`/`);
};

const Workspace = () => {
  return <div>Redirecting...</div>;
};

export default Workspace;
