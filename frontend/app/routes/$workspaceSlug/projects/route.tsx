import { LoaderFunctionArgs } from "@remix-run/node";
import { getProjects } from "../../api/projects";
import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const projects = await getProjects(request);
  return { projects };
};

const Projects = () => {
  const loaderData = useLoaderData();
  useEffect(() => {
    console.log(loaderData);
  }, []);

  return <div>This is a list of projects</div>;
};

export default Projects;
