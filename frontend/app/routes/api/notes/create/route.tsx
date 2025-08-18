import { ActionFunctionArgs } from "react-router";
import { createNote } from "~/api/notes";
import { redirect } from "@remix-run/node";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  console.log("this is formData", formData);
  const title = formData.get("title") as string;
  const text_content = formData.get("text_content") as string;
  const rich_content = (formData.get("rich_content") || {}) as string;
  const workspaceSlug = formData.get("workspaceSlug") as string;
  const projectSlug = formData.get("projectSlug") as string;

  console.log("this is the project slug", projectSlug);
  const result = await createNote(
    request,
    workspaceSlug,
    projectSlug,
    title,
    text_content,
    rich_content
  );

  // Get current workspaceSlug
  return redirect(`/${workspaceSlug}/${projectSlug}/${result.id}`);
};
