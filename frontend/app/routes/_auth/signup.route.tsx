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
import { Form, Link, useActionData } from "@remix-run/react";
import { Label } from "~/components/ui/label";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import {
  accessTokenCookie,
  createUser,
  login,
  requestUserVerification,
} from "../api/auth";
import { useEffect, useState } from "react";
import { AuthNav } from "./_layout";
import { motion } from "framer-motion";

const Signup = () => {
  const actionData = useActionData<{ error: string }>();
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("actionData", actionData);
    if (actionData?.error) {
      setError(actionData.error);
    }
    console.log("error", error);
  }, [actionData, error]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Form method="post" className="flex flex-col gap-4">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              type="text"
              placeholder="e.g. John"
              name="first_name"
              autoComplete="given-name"
            />
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              type="text"
              placeholder="e.g. Doe"
              name="last_name"
              autoComplete="family-name"
            />
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              placeholder="e.g. john.doe@example.com"
              name="email"
              autoComplete="email"
            />
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              placeholder="Password"
              name="password"
              autoComplete="new-password"
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              name="password_confirmation"
              autoComplete="new-password"
            />
            <Button className="w-full" type="submit">
              Sign Up
            </Button>
          </Form>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Separator />
          <div className="w-full flex justify-center items-center space-x-4">
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
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default Signup;

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!first_name || !last_name || !email || !password) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const newUser = await createUser(first_name, last_name, email, password);

  if (newUser.error) {
    if (newUser.error === "User already exists") {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(newUser.error, { status: 400 });
  }

  // Request user verification that will send a verification email to the user
  await requestUserVerification(email);

  // Login the user (will get redirected to the verification page)
  const user = await login(email, password);
  const { access_token } = user;
  const cookieHeader = accessTokenCookie.serialize(access_token);
  console.log("[API] AUTH - login() - cookieHeader", cookieHeader);
  return redirect("/app", {
    headers: {
      "Set-Cookie": cookieHeader,
    },
  });
};
