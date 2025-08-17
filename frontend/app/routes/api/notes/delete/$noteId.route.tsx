import { getRoutePathConflictErrorMessage } from "@remix-run/dev/dist/config/flat-routes";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { deleteNote } from "~/api/notes";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const redirectLink = (formData.get("redirectLink") || "") as string;
  const noteId = params.noteId as string;
  try {
    const result = await deleteNote(request, noteId);
    console.log("result after deleting the note", result);
    return redirect(redirectLink);
  } catch (error) {
    console.log("error deleting the note", error);
    return error;
  }
};
