import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { accessTokenCookie, logout } from "../api/auth";

export const loader = async ({request}: LoaderFunctionArgs) => {
    await logout(request)
    return redirect("/",{headers: {
        "Set-Cookie": await accessTokenCookie.serialize(""),
      },})
}   

export default function Logout() {
    return null
}

