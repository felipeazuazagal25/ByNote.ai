import { ActionFunctionArgs } from "react-router";
import { createNote } from "~/api/notes";
import { redirect } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  console.log("this is formData", formData);
  const title = formData.get("title") as string;
  const text_content = formData.get("text_content") as string;
  const rich_content = (formData.get("rich_content") || {}) as JSON;
  const workspaceSlug = formData.get("workspaceSlug") as string;
  console.log("this is rich_context", JSON.stringify(rich_content));
  const result = await createNote(
    request,
    workspaceSlug,
    title,
    text_content,
    rich_content
  );

  // Get current workspaceSlug
  return redirect(`/${workspaceSlug}/inbox/${result.id}`);
};
