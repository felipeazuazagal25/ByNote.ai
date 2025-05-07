import { Outlet, useLoaderData } from "@remix-run/react";
import GridBackground from "~/components/ui/grid-background";
import { getProjects } from "../api/projects";
import { LoaderFunctionArgs } from "@remix-run/node";


export const loader = async ({request}: LoaderFunctionArgs) => {
    const url = new URL(request.url).pathname
    console.log("url", url)
    if (url === "/app") {
        // Default behavior when user is logged in
        const projects = await getProjects(request)
        return new Response(JSON.stringify({loadDefaultApp: true, projects}), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } else {
        return {loadDefaultApp: false, projects: null}
    }
    
}


const Layout = () => {
    const {loadDefaultApp, projects} = useLoaderData<typeof loader>()

    return ( 
        <GridBackground>
            <div className="w-full h-full">
                {loadDefaultApp? 
                <DefaultApp /> : 
                <Outlet />}
            </div>
        </GridBackground>
     );
}
 
export default Layout;



const DefaultApp = () => {
    return (
        <div className="w-full h-ful l flex justify-center items-center">
            <h1>Default App</h1>
        </div>
    )
}
