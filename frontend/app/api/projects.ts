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

export const getProjectBySlug = async (
  request: Request,
  workspaceId: string,
  projectSlug: string
) => {
  const response = await authFetch(
    request,
    `/projects/slug/${projectSlug}?workspace_id=${workspaceId}`,
    { method: "GET" }
  );

  if (!response.ok) {
    console.log(response);
    return new Response(JSON.stringify({ error: "Failed to fetch projects" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return response.json();
};

export const createProject = async (
  request: Request,
  name: string,
  description: string,
  is_archived: boolean,
  is_shared: boolean,
  is_deleted: boolean,
  ui_color: string,
  ui_icon: string,
  ui_theme: string,
  ui_font: string,
  workspaceSlug: string
) => {
  const requestUrl = workspaceSlug
    ? `/projects?workspace_slug=${workspaceSlug}`
    : `/projects`;

  const response = await authFetch(request, requestUrl, {
    method: "POST",
    body: JSON.stringify({
      name,
      description,
      is_archived,
      is_shared,
      is_deleted,
      ui_color,
      ui_icon,
      ui_theme,
      ui_font,
    }),
  });

  return response.json();
};

export const editProject = async (
  request: Request,
  projectId: string,
  name: string,
  description: string,
  is_archived: boolean,
  is_shared: boolean,
  is_deleted: boolean,
  ui_color: string,
  ui_icon: string,
  ui_theme: string,
  ui_font: string
) => {
  const requestUrl = `/projects/${projectId}`;
  const response = await authFetch(request, requestUrl, {
    method: "PUT",
    body: JSON.stringify({
      id: projectId,
      name,
      description,
      is_archived,
      is_shared,
      is_deleted,
      ui_color,
      ui_icon,
      ui_theme,
      ui_font,
    }),
  });

  return response.json();
};

export const deleteProject = async (
  request: Request,
  projectId: string,
  moveNotes: string,
  destinationProjectId: string,
  workspaceSlug?: string
) => {
  const params = new URLSearchParams({
    move_notes: moveNotes,
    destination_project_id: destinationProjectId,
  });
  const requestUrl = `/projects/${projectId}?${params.toString()}`;
  console.log("this is the request URL", requestUrl);
  const response = await authFetch(request, requestUrl, {
    method: "DELETE",
  });

  console.log("the response was not ok", response);
  if (response.status !== 204) {
    return new Response(
      JSON.stringify({
        ok: false,
        message: "Error deleting the project.",
      })
    );
  }

  return new Response(
    JSON.stringify({
      ok: true,
      message: "Project deleted succesfully.",
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export type deleteProjectResponseType = {
  ok: boolean;
  message: string;
};
