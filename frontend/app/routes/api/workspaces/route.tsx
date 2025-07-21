import { redirect } from "@remix-run/node";
import { getCurrentUser } from "~/api/auth";
import { UserInfo } from "~/types/userInfo";

export const loader = async ({ request }: { request: Request }) => {
  const user: UserInfo = await getCurrentUser(request);
  return redirect(`/${user.default_workspace_id}`);
};

const Workspace = () => {
  return <div>Redirecting...</div>;
};

export default Workspace;
