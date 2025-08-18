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

export const createNote = async (
  request: Request,
  workspaceSlug: string,
  projectSlug: string = "",
  title: string,
  text_content: string,
  rich_content: string
) => {
  const requestUrl = `/notes/${workspaceSlug}?project_slug=${projectSlug}`;
  const response = await authFetch(request, requestUrl, {
    method: "POST",
    body: JSON.stringify({
      title,
      text_content,
      rich_content: JSON.parse(rich_content),
      is_archived: false,
      is_shared: false,
      is_starred: false,
      is_pinned: false,
    }),
  });
  return response.json();
};

export const editNote = async (
  request: Request,
  noteId: string,
  title: string,
  text_content: string,
  rich_content: string,
  is_archived: boolean,
  is_shared: boolean,
  is_starred: boolean,
  is_pinned: boolean
) => {
  const response = await authFetch(request, `/notes/${noteId}`, {
    method: "PUT",
    body: JSON.stringify({
      title,
      text_content,
      rich_content: JSON.parse(rich_content),
      is_archived,
      is_shared,
      is_starred,
      is_pinned,
    }),
  });
  return response.json();
};

export const deleteNote = async (request: Request, noteId: string) => {
  const response = await authFetch(request, `/notes/${noteId}`, {
    method: "DELETE",
  });
  return response;
};
