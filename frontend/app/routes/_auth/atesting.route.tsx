import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Button } from "~/components/ui/button";
import { requestUserVerification } from "../../api/auth";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Form } from "@remix-run/react";
import { compile } from "sass";

const API_URL = process.env.API_URL;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return null;
};

const Testing = () => {
  const [email, setEmail] = useState("");

  return (
    <div className="flex flex-col gap-4 min-h-screen min-w-screen   ">
      Testing
      <Form method="post">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          name="email"
          className="w-full min-w-lg"
        />
        <Button type="submit">Test</Button>
      </Form>
    </div>
  );
};

export default Testing;

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("action");
  try {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    console.log("email", email);
    const response = await requestUserVerification(email);
    console.log("response", response);
    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), {
      headers: { "Content-Type": "application/json" },
    });
  }
  return null;
};
