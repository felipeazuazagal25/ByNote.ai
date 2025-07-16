import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const projectSlug = params.projectSlug;
  return new Response(JSON.stringify({ projectSlug }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
const Project = () => {
  const { projectSlug } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Project {projectSlug}</h1>
    </div>
  );
};

export default Project;
