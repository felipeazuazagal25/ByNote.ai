import { Link, Outlet } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import GridBackground from "~/components/ui/grid-background";
import { useLocation } from "@remix-run/react";
import { buttonVariants } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

export default function AuthLayout() {
  const location = useLocation();

  return (
    <GridBackground>
      <motion.div className="relative flex min-h-screen items-center justify-center">
        <Outlet />
      </motion.div>
    </GridBackground>
  );
}

interface AuthNavProps {
  type: "login" | "signup";
}

export function AuthNav({ type }: AuthNavProps) {
  return (
    <>
      <Separator />
      <div className="w-full flex justify-center items-center space-x-4">
        {type === "login" ? (
          <>
            <div className="text-sm text-gray-500">Don't have an account? </div>
            <Link
              to="/signup"
              className={buttonVariants({
                variant: "outline",
              })}
              prefetch="intent"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <div className="text-sm text-gray-500">
              Already have an account?{" "}
            </div>
            <Link
              to="/login"
              className={buttonVariants({
                variant: "outline",
              })}
              prefetch="intent"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </>
  );
}
