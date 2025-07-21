import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { getCurrentUser, requestUserVerification } from "../../api/auth";
import { Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";

const API_URL = process.env.API_URL;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getCurrentUser(request);
  if (!user) {
    return redirect("/login");
  }
  if (user.is_verified) {
    return redirect("/");
  }

  return null;
};

const LoginVerify = () => {
  return (
    <div>
      <h1>Login Verify</h1>
      Please verify your email to continue.
      <Form method="post">
        <Button type="submit">Send Verification Email Again</Button>
      </Form>
    </div>
  );
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await getCurrentUser(request);
  if (!user) {
    return redirect("/login");
  }
  try {
    const response = await requestUserVerification(user.email);
    console.log("[VERIFY ROUTE] response", response);
  } catch (error) {
    console.error("[VERIFY ROUTE] error", error);
  }
  return new Response(JSON.stringify({ message: "Verification email sent" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export default LoginVerify;
