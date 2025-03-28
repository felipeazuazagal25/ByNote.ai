import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async () => {
  const apiUrl = process.env.API_URL || "http://localhost:8000";
  const fetchUrl = `${apiUrl}/notes`;

  const response = await fetch(fetchUrl, {
    method: "GET",
    headers: { "Content-type": "application/json" },
  });
  const data = await response.json();
  console.log("this is the data", data);
  return new Response(JSON.stringify({ data }), {
    status: 200,
    headers: { "Content-type": "application/json" },
  });
};

export default function Index() {
  const { data } = useLoaderData<typeof loader>();

  useEffect(() => {
    console.log("this is the data", data);
  }, [data]);

  return (
    <div className="flex h-screen items-center justify-center">
      This is my new app What you can do here is incredible. Now i need to
      connect both apps
    </div>
  );
}
