import { ActionFunctionArgs } from "@remix-run/node";
import { deleteProject } from "~/api/projects";
import { deleteProjectResponseType } from "~/api/projects";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const projectId = params.projectId as string;
  const formData = await request.formData();
  const moveNotes = formData.get("moveNotes") as string;
  const destinationProjectId = formData.get("destinationProjectId") as string;

  try {
    console.log("STARTING THE DELETION IN THE ENDPOINT");
    const result = await deleteProject(
      request,
      projectId,
      moveNotes,
      destinationProjectId
    );
    console.log("this is the result", result);

    return result;
  } catch (error) {
    return new Response(
      JSON.stringify({
        ok: false,
        message: "Error deleting the project.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
