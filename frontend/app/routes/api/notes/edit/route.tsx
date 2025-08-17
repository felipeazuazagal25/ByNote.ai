import { ActionFunctionArgs } from "@remix-run/node";
import { editNote } from "~/api/notes";

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  console.log("formData", formData);
  const noteId = formData.get("id") as string;
  const title = formData.get("title") as string;
  const text_content = formData.get("text_content") as string;
  const rich_content = formData.get("rich_content") as string;
  const is_archived = (formData.get("is_archived") || false) as boolean;
  const is_shared = (formData.get("is_shared") || false) as boolean;
  const is_starred = (formData.get("is_starred") || false) as boolean;
  const is_pinned = (formData.get("is_pinned") || false) as boolean;
  console.log("this is rich_content", rich_content);

  const result = await editNote(
    request,
    noteId,
    title,
    text_content,
    rich_content,
    is_archived,
    is_shared,
    is_starred,
    is_pinned
  );
  return result;
};
