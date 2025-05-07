import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({params}: LoaderFunctionArgs) => {
    const projectId = params.projectId
    return new Response(JSON.stringify({projectId}), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
const Project = () => {
    const {projectId} = useLoaderData<typeof loader>()
    return ( 
        <div>
            <h1>Project {projectId}</h1>
        </div>
     );
}
 
export default Project;