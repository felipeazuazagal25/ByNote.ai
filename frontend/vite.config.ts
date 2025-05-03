import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { flatRoutes } from "remix-flat-routes";

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
      routes: async (defineRoutes) => {
        return flatRoutes("routes", defineRoutes, {
          ignoredRouteFiles: ["**/.*"],
          appDir: "app",
          routeDir: "routes",
          basePath: "/",
          paramPrefixChar: "$",
          nestedDirectoryChar: "-",
        });
      },
      ignoredRouteFiles: ["**/*.test.ts", "**/*.spec.ts"],
    }),
    tsconfigPaths(),
  ],
  optimizeDeps: {
    exclude: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ],
  },
});
