import { createCookieSessionStorage } from "@remix-run/node";

const DEBUG = process.env.NODE_ENV === "development";
const apiUrl = process.env.API_URL || "http://backend:8000";

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

  // Add the bearer token to as a cookie in the header
  const sessionStorage = createCookieSessionStorage({
    cookie: {
      name: "access_token",
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      secrets: [process.env.COOKIE_SECRET || "S3cret"],
      sameSite: "lax",
    },
  });

  // Create a new session and set the token
  const session = await sessionStorage.getSession();
  session.set("access_token", data.access_token);

  const headers = new Headers();
  headers.append("Set-Cookie", await sessionStorage.commitSession(session));

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: headers,
  });
};
