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
import { userInfo } from "node:os";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
const passwordPolicy = {
  minLength: false,
  hasUppercase: false,
  hasLowercase: false,
  hasNumber: false,
  hasSpecialChar: false,
};

const checkPasswordPolicy = (password: string) => {
  const passObj = { ...passwordPolicy };
  passObj.minLength = password.length >= 8;
  passObj.hasUppercase = /[A-Z]/.test(password);
  passObj.hasLowercase = /[a-z]/.test(password);
  passObj.hasNumber = /\d/.test(password);
  passObj.hasSpecialChar = /[!@#$%^&*]/.test(password);
  return passObj;
};

const Signup = () => {
  const actionData = useActionData<{ error: string }>();
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordPolicyObject, setPasswordPolicyObject] =
    useState(passwordPolicy);

  useEffect(() => {
    console.log("actionData", actionData);
    if (actionData?.error) {
      setError(actionData.error);
    }
    console.log("error", error);
  }, [actionData, error]);

  useEffect(() => {
    const passObj = checkPasswordPolicy(password);
    setPasswordPolicyObject(passObj);
  }, [password]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-center">
          <CardTitle className="text-2xl font-serif">Sign Up</CardTitle>
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
              onChange={(e) => {
                const password = e.target.value;
                setPassword(password);
              }}
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              name="password_confirmation"
              autoComplete="off"
            />

            <div className="flex flex-col gap-2 text-sm text-gray-500">
              {/* dynamic list of password policy requirements */}
              <ul>
                <PasswordPolicyComponent
                  satisfies={passwordPolicyObject.minLength}
                  active={password !== ""}
                >
                  <span>At least 8 characters long</span>
                </PasswordPolicyComponent>

                <PasswordPolicyComponent
                  satisfies={passwordPolicyObject.hasUppercase}
                  active={password !== ""}
                >
                  <span>At least one uppercase letter</span>
                </PasswordPolicyComponent>

                <PasswordPolicyComponent
                  satisfies={passwordPolicyObject.hasLowercase}
                  active={password !== ""}
                >
                  <span>At least one lowercase letter</span>
                </PasswordPolicyComponent>

                <PasswordPolicyComponent
                  satisfies={passwordPolicyObject.hasNumber}
                  active={password !== ""}
                >
                  <span>At least one number</span>
                </PasswordPolicyComponent>

                <PasswordPolicyComponent
                  satisfies={passwordPolicyObject.hasSpecialChar}
                  active={password !== ""}
                >
                  <span>At least one special character</span>
                </PasswordPolicyComponent>
              </ul>
            </div>

            <Button
              className="w-full"
              type="submit"
              disabled={
                !passwordPolicyObject.minLength ||
                !passwordPolicyObject.hasUppercase ||
                !passwordPolicyObject.hasLowercase ||
                !passwordPolicyObject.hasNumber ||
                !passwordPolicyObject.hasSpecialChar
              }
            >
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
  const password_confirmation = formData.get("password_confirmation") as string;

  if (!first_name || !last_name || !email || !password) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (password !== password_confirmation) {
    return new Response(JSON.stringify({ error: "Passwords do not match" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Check if password satifies the password policy

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
  return redirect("/verify", {
    headers: {
      "Set-Cookie": cookieHeader,
    },
  });
};

const PasswordPolicyComponent = ({
  children,
  satisfies,
  active,
}: {
  children: React.ReactNode;
  satisfies: boolean;
  active: boolean;
}) => {
  return (
    <li
      className={`transition-colors duration-300 flex items-center gap-1 ${
        active
          ? satisfies
            ? "text-green-500"
            : "text-red-500"
          : "text-gray-500"
      }`}
    >
      <div className="w-4 h-4">
        {/*  */}
        {active ? satisfies ? <CheckCircleIcon /> : <XCircleIcon /> : null}
      </div>
      {children}
    </li>
  );
};
