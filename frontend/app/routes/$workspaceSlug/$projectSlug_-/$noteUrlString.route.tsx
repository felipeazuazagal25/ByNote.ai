import { LoaderFunctionArgs } from "@remix-run/node";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return 1;
};

const NoteEditing = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Editing the note</CardTitle>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};

export default NoteEditing;
