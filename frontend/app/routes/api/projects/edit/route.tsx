import { ActionFunctionArgs } from "@remix-run/node";
import { editProject } from "~/api/projects";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const projectId = formData.get("projectId") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const is_archived = (formData.get("is_archived") || false) as boolean;
  const is_shared = (formData.get("is_shared") || false) as boolean;
  const is_deleted = (formData.get("is_deleted") || false) as boolean;
  const ui_color = formData.get("ui_color") as string;
  const ui_icon = formData.get("icon") as string;
  const ui_theme = "";
  const ui_font = "";

  try {
    const result = await editProject(
      request,
      projectId,
      name,
      description,
      is_archived,
      is_deleted,
      is_shared,
      ui_color,
      ui_icon,
      ui_theme,
      ui_font
    );
    console.log("this is the result from the function", JSON.stringify(result));
    return { ok: true, message: "Project edited." };
  } catch (error) {
    console.log("Error creating the project", error);
    return error;
  }
};
