import { Outlet } from "@remix-run/react";
import { motion } from "framer-motion";
import GridBackground from "~/components/ui/grid-background";
import { useLocation } from "@remix-run/react";

export default function AuthLayout() {
  const location = useLocation();

  return (
    <GridBackground>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.15, ease: "easeInOut" }}
        className="relative flex min-h-screen items-center justify-center"
      >
        <div className="w-full">
          <Outlet />
        </div>
      </motion.div>
    </GridBackground>
  );
}
