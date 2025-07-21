import { Input } from "~/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button, buttonVariants } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Form, Link, useActionData, useNavigate } from "@remix-run/react";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { accessTokenCookie, getCurrentUser, login } from "~/api/auth";
import { useEffect } from "react";
import { Label } from "~/components/ui/label";
import { motion } from "framer-motion";
import { Alert, AlertTitle, AlertDescription } from "~/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

const API_URL = process.env.API_URL;

export const loader = async ({ request }: { request: Request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const accessToken = accessTokenCookie.parse(cookieHeader);

  if (!accessToken) {
    return null;
  }

  const response = await fetch(`${API_URL}/auth/me`, {
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
    return null;
  }

  return redirect("/", {
    headers: {
      "Set-Cookie": accessTokenCookie.serialize(accessToken),
    },
  });
};

const Login = () => {
  const actionData = useActionData<typeof action>();
  // const navigate = useNavigate();

  useEffect(() => {
    console.log("actionData", actionData);
    if (actionData?.user) {
      console.log("user", actionData.user);
    }
  }, [actionData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-center">
          <CardTitle className="text-2xl font-serif">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="post" className="flex flex-col gap-4">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              placeholder="Email"
              name="email"
              className="autofill:bg-red-800 dark:autofill:bg-gray-800"
            />
            <Label htmlFor="password">Password</Label>
            <Input type="password" placeholder="Password" name="password" />
            <Button className="w-full" type="submit">
              Login
            </Button>
          </Form>
          {actionData?.error && (
            <Alert variant="destructive" className="text-red-400 mt-4">
              <AlertTitle>
                Email or/and password are incorrect. Please try again.
              </AlertTitle>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Separator />
          <div className="w-full flex justify-center items-center space-x-4">
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
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: "Email and password are required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  // Login the user
  try {
    const user = await login(email, password);
    // access_token of a user already logged in
    const { access_token } = user;
    const cookieHeader = accessTokenCookie.serialize(access_token);
    console.log("[API] AUTH - login() - cookieHeader", cookieHeader);
    return redirect("/verify", {
      headers: {
        "Set-Cookie": cookieHeader,
      },
    });
  } catch (error) {
    console.log("error", error);
    return new Response(
      JSON.stringify({ error: "Invalid email or password" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export default Login;
