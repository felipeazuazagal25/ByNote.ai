import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { getCurrentUser } from "~/api/auth";
import { deleteWorkspace } from "~/api/workspaces";
import { UserInfo } from "~/types/userInfo";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  if (request.method !== "DELETE") {
    throw new Error("Invalid request method");
  }
  console.log();
  const workspaceId = params.workspaceId || "";
  if (!workspaceId) {
    return redirect(`/`);
  }
  await deleteWorkspace(request, workspaceId);
  return redirect(`/`);
};
