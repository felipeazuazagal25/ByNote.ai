import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getCurrentUser } from "./api/auth";
import GridBackground from "~/components/ui/grid-background";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button, buttonVariants } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Link } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const accessToken = cookieHeader
    ?.split("; ")
    .find((row) => row.startsWith("access_token="))
    ?.split("=")[1];

  if (!accessToken) {
    return redirect("/");
  }

  const user = await getCurrentUser(request);
  console.log("[API] VERIFY - loader() - user", user);
  if (user.is_verified) {
    return redirect("/app");
  }
  return null;
};

const Verify = () => {
  return (
    <GridBackground>
      <div className="relative flex h-screen w-screen items-center justify-center">
        <Card className="w-full max-w-md hover:scale-105 transition-all duration-300">
          <CardHeader>
            <CardTitle>Verify</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              Please check your email for a verification link. If you don't see
              it, please check your spam folder.
            </div>
            <div className="flex items-center gap-2">
              Already Veryfied?{" "}
              <Link
                className={buttonVariants({ variant: "outline" })}
                to="/app"
              >
                Click Here
              </Link>
            </div>
            <Separator />
            <div className="flex items-center gap-2">
              Didn't receive the email?{" "}
              <Button variant="link" className="p-0">
                Resend Verification Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </GridBackground>
  );
};

export default Verify;
