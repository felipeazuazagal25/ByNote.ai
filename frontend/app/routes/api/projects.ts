import { LoaderFunctionArgs } from "@remix-run/node"

const API_URL = process.env.API_URL
const DEBUG = process.env.NODE_ENV === "development"

export const getProjects = async (request: Request) => {
    // Get access_token from the cookies
    const cookieHeader = request.headers.get("Cookie");
    const accessToken = cookieHeader?.split("; ").find((row) =>
      row.startsWith("access_token=")
    )?.split("=")[1];

    if (DEBUG) console.log("[API] PROJECTS - getProjects() - accessToken", accessToken)

    const response = await fetch(`${API_URL}/projects`, 
        {
            method: "GET",
            headers: 
            {
                'Authorization': `Bearer ${accessToken}`,
            }
        }
    )
    if (!response.ok) {
        return new Response(JSON.stringify({error: "Failed to fetch projects"}), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    return response.json()
}
