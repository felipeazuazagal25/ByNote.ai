import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { createWorkspace } from "~/api/workspaces";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (name === "") {
    return new Response(
      JSON.stringify({ error: 'Field "name" must be provided' }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const result = await createWorkspace(request, name, description);
    console.log("[API - WORKSPACES] this is the result", result);
    return new Response(JSON.stringify({ success: true, slug: result.slug }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error creating the workspace" }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
