import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async () => {
  const response = await fetch("http://backend:8000", {
    method: "GET",
    headers: { "Content-type": "application/json" },
  });
  const data = await response.json();
  console.log("this is the data", data);
  return null;
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      This is my new app What you can do here is incredible. Now i need to
      connect both apps
    </div>
  );
}
