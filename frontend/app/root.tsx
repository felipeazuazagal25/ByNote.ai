import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
// import { dataContext } from "~/context/dataContext.server";

import "./tailwind.css";
import "./styles/sonner.css";
import { useState, useEffect } from "react";
import { useUIState } from "./hooks/useUIState";

import { Toaster } from "~/components/ui/sonner";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Roboto+Serif:ital,wght@0,100..900;1,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check if user has a theme preference
    if (typeof window !== "undefined") {
      if (
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        setTheme("dark");
        document.documentElement.classList.add("dark");
      } else {
        setTheme("light");
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.theme = newTheme;
    document.documentElement.classList.toggle("dark");
  };

  return (
    <html lang="en" className="h-full ">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <div className="relative h-full">
          {children}
          <button
            onClick={toggleTheme}
            className="z-20 fixed bottom-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:ring-2 hover:ring-blue-400 transition-all"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
        <Toaster position="top-center" richColors />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// export const context = dataContext;

export default function App() {
  const [showSidebar, setShowSidebar] = useUIState("showSidebar", true);

  return (
    <Outlet
      context={{
        showSidebar,
        setShowSidebar,
      }}
    />
  );
}
