
import { createCookie, redirect } from "@remix-run/node";

const DEBUG = process.env.NODE_ENV === "development";
const apiUrl = process.env.API_URL || "http://backend:8000";


export const accessTokenCookie = {
  serialize: (value: string) => `access_token=${value}; Max-Age=86400; Path=/; HttpOnly; SameSite=Lax`,
  parse: (cookieHeader: string | null) => {
    if (!cookieHeader) return null;
    return cookieHeader
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1];
  }
};


export const login = async (email: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);
  formData.append("grant_type", "password");

  const response = await fetch(`${apiUrl}/auth/jwt/login`, {
    method: "POST",
    body: formData,
    headers: {
      accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  const data = await response.json();

  if (DEBUG) console.log("[API] AUTH - login() - response", response);
  if (DEBUG) console.log("[API] AUTH - login() - data", data);


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

export const logout = async (request: Request) => {
  const cookieHeader = request.headers.get("Cookie");
    const accessToken = cookieHeader?.split("; ").find((row) =>
      row.startsWith("access_token=")
    )?.split("=")[1];


  const response = await fetch(`${apiUrl}/auth/jwt/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

