import { authFetch } from "./auth";

const API_URL = process.env.API_URL;
const DEBUG = process.env.NODE_ENV === "development";

export const getProjects = async (request: Request, workspaceId: string) => {
  const response = await authFetch(
    request,
    `/projects?workspace_id=${workspaceId}`,
    {
      method: "GET",
    }
  );
  if (!response.ok) {
    return new Response(JSON.stringify({ error: "Failed to fetch projects" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return response.json();
};
