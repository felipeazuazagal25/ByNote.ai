import { authFetch } from "./auth";

export const getWorkspaces = async (request: Request) => {
  const response = await authFetch(request, "/workspaces", {
    method: "GET",
  });
  return response.json();
};

export const getWorkspace = async (request: Request, workspaceId: string) => {
  const response = await authFetch(request, `/workspaces/${workspaceId}`, {
    method: "GET",
  });
  return response.json();
};

export const getWorkspaceBySlug = async (
  request: Request,
  workspaceSlug: string
) => {
  const response = await authFetch(
    request,
    `/workspaces/slug/${workspaceSlug}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error("No workspace with the requested slug.");
  }

  return response.json();
};

export const createWorkspace = async ({
  request,
  name,
}: {
  request: Request;
  name: string;
}) => {
  const response = await authFetch(request, "/workspaces", {
    method: "POST",
    body: { name },
  });
  return response.json();
};

export const deleteWorkspace = async (
  request: Request,
  workspaceId: string
) => {
  const response = await authFetch(request, `/workspaces/${workspaceId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Error deleting workspace with id ${workspaceId}`);
  }
  return response.json();
};
