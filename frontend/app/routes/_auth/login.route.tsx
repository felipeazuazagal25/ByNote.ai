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
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { accessTokenCookie, login } from "~/routes/api/auth";
import { useEffect } from "react";
import { Label } from "~/components/ui/label";

const Login = () => {
  const actionData = useActionData<typeof action>();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   console.log("actionData", actionData);
  //   if (actionData?.user) {
  //     console.log("user", actionData.user);
  //   }
  // }, [actionData]);

  return (
    <div className="h-full min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-center">
          <CardTitle className="text-2xl ">Login</CardTitle>
        </CardHeader>
        <CardContent className="">
          <Form method="post" className="flex flex-col gap-4">
            <Label htmlFor="email">Email</Label>
            <Input type="email" placeholder="Email" name="email" />
            <Label htmlFor="password">Password</Label>
            <Input type="password" placeholder="Password" name="password" />
            <Button className="w-full" type="submit">
              Login
            </Button>
          </Form>
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
            >
              Sign Up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
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
  try{
    const user = await login(email, password);
    // access_token of a user already logged in
    const { access_token } = user;
    const cookieHeader = accessTokenCookie.serialize(access_token);
    console.log("[API] AUTH - login() - cookieHeader", cookieHeader)
    return redirect("/app", {
      headers: {
          "Set-Cookie": cookieHeader,
        },
      });
  } catch (error) {
    console.log("error", error);
    return new Response(JSON.stringify({ error: "Invalid email or password" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export default Login;
