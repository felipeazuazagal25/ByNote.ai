import { createCookie, redirect } from "@remix-run/node";

const DEBUG = process.env.NODE_ENV === "development";
const apiUrl = process.env.API_URL || "http://backend:8000";


export const accessTokenCookie = createCookie("access_token", {
  maxAge: 60 * 60 * 24, // 1 day
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
});


export const login = async (email: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);
  formData.append("grant_type", "password");

  const response = await fetch(`${apiUrl}/auth/jwt/login`, {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  const data = await response.json();

  if (DEBUG) console.log("response", response);
  if (DEBUG) console.log("data", data);


  if (!response.ok) {
    if (data.details === "LOGIN_BAD_CREDENTIALS") {
      throw new Response(
        JSON.stringify({
          message: "Invalid email or password",
          ok: false,
        })
      );
    }
    throw new Response(
      JSON.stringify({
        message: "Failed to login",
        ok: false,
      })
    );
  }

  return data
};

export const logout = async () => {
  const response = await fetch(`${apiUrl}/auth/jwt/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  throw redirect("/", {
    headers: {
      "Set-Cookie": await accessTokenCookie.serialize(""),
    },
  });
};

