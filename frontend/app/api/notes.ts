import { authFetch } from "./auth";

const API_URL = process.env.API_URL;
const DEBUG = process.env.NODE_ENV === "development";

export const getNote = async (
  request: Request,
  noteId: string,
  projectSlug: string,
  workspaceSlug: string
) => {
  const response = await authFetch(
    request,
    `/notes/${noteId}?project_slug=${projectSlug}&workspace_slug=${workspaceSlug}`,
    {
      method: "GET",
    }
  );

  return response.json();
};
