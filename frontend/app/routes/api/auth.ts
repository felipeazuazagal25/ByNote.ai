import { createCookie, redirect } from "@remix-run/node";

const DEBUG = process.env.NODE_ENV === "development";
const apiUrl = process.env.API_URL || "http://backend:8000";

export const accessTokenCookie = {
  serialize: (value: string) =>
    `access_token=${value}; Max-Age=86400; Path=/; HttpOnly; SameSite=Lax`,
  parse: (cookieHeader: string | null) => {
    if (!cookieHeader) return null;
    return cookieHeader
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1];
  },
};

export const createUser = async (
  first_name: string,
  last_name: string,
  email: string,
  password: string
) => {
  const response = await fetch(`${apiUrl}/auth/register`, {
    method: "POST",
    body: JSON.stringify({ first_name, last_name, email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (DEBUG) console.log("[API] AUTH - createUser() - response", response);
  const data = await response.json();
  if (DEBUG) console.log("[API] AUTH - createUser() - data", data);
  if (data.detail === "REGISTER_USER_ALREADY_EXISTS") {
    return { error: "User already exists" };
  }
  return data;
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
  return data;
};

export const requestUserVerification = async (email: string) => {
  const response = await fetch(`${apiUrl}/auth/request-verify-token`, {
    method: "POST",
    body: JSON.stringify({ email }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Response(
      JSON.stringify({ message: "Failed to request user verification" }),
      { status: response.status }
    );
  }
};

export const logout = async (request: Request) => {
  const cookieHeader = request.headers.get("Cookie");
  const accessToken = cookieHeader
    ?.split("; ")
    .find((row) => row.startsWith("access_token="))
    ?.split("=")[1];

  const response = await fetch(`${apiUrl}/auth/jwt/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getCurrentUser = async (request: Request) => {
  const cookieHeader = request.headers.get("Cookie");
  const accessToken = accessTokenCookie.parse(cookieHeader);

  if (!accessToken) {
    throw new Response(
      JSON.stringify({
        message: "Not authenticated",
        ok: false,
      }),
      { status: 401 }
    );
  }

  const response = await fetch(`${apiUrl}/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    redirect("/login", {
      headers: {
        "Set-Cookie": accessTokenCookie.serialize(""),
      },
    });
    // throw new Response(
    //   JSON.stringify({
    //     message: "Failed to fetch user data",
    //     ok: false,
    //   }),
    //   { status: response.status }
    // );
  }
  const data = await response.json();
  if (data.detail === "Unauthorized") {
    throw redirect("/login", {
      headers: {
        "Set-Cookie": accessTokenCookie.serialize(""),
      },
    });
  }

  return data;
};

export const authFetch = async (
  request: Request,
  url: string,
  options: {
    method: string;
    body?: any;
    headers?: Record<string, string>;
  }
) => {
  const cookieHeader = request.headers.get("Cookie");
  const accessToken = accessTokenCookie.parse(cookieHeader);

  if (!accessToken) {
    throw redirect("/login", {
      headers: {
        "Set-Cookie": accessTokenCookie.serialize(""),
        "Content-Type": "application/json",
      },
    });
  }

  const response = await fetch(`${apiUrl}${url}`, {
    method: options.method,
    body: options.body,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (response.status === 401) {
    throw redirect("/login", {
      headers: {
        "Set-Cookie": accessTokenCookie.serialize(""),
        "Content-Type": "application/json",
      },
    });
  }

  const user = await getCurrentUser(request);
  if (!user.is_verified) {
    throw redirect("/verify");
  }

  return response;
};
