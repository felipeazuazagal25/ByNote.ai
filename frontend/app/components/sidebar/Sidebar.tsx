import { motion } from "framer-motion";
import { Link } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { ObjectGroup } from "~/components/sidebar/ObjectGroup";
import ButtonWithShortcut from "~/components/ui/button-shortchut";
import { CreateNoteShortcuts, CreateProjectShortcuts } from "~/utils/shortcuts";
import { FolderClosed, StickyNote } from "lucide-react";
import { buttonVariants } from "../ui/button";

const AppSidebar = ({
  open,
  setOpen,
  workspace,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  workspace: any;
}) => {
  return (
    <motion.div
      className="flex flex-col px-5 z-10"
      animate={{
        width: open ? "30%" : "0px",
        minWidth: open ? "16rem" : "0px",
        maxWidth: open ? "20rem" : "0px",
      }}
      transition={{
        duration: open ? 0.1 : 0.2,
        ease: "easeInOut",
      }}
    >
      <motion.div
        className="flex-1 w-full flex flex-col"
        animate={{ opacity: open ? 1 : 0 }}
        transition={{
          duration: open ? 0.2 : 0.1,
          ease: "easeInOut",
        }}
      >
        <Card className="flex-1 w-full flex flex-col text-nowrap bg-white dark:bg-black">
          <CardHeader>
            <div className="flex flex-col gap-2">
              <ButtonWithShortcut
                shortcuts={CreateNoteShortcuts}
                OS="macOS"
                variant="default"
                onClick={() => {
                  console.log("Creating New Note...");
                }}
              >
                New Note
              </ButtonWithShortcut>
              <ButtonWithShortcut
                shortcuts={CreateProjectShortcuts}
                OS="macOS"
                variant="outline"
                onClick={() => {
                  console.log("Creating New Project...");
                }}
              >
                New Project
              </ButtonWithShortcut>
            </div>
          </CardHeader>
          <CardContent className="flex-1 ">
            <CardDescription>
              <div className="text-xs text-gray-500 font-serif">
                Your Content
              </div>
              <ObjectGroup
                categoryName={"Projects"}
                objects={workspace.topNProjects}
                icon={<FolderClosed className="w-5 h-5" />}
                showAllLink={"/projects"}
              />
              <ObjectGroup
                categoryName={"Notes"}
                objects={workspace.topNNotes}
                icon={<StickyNote className="w-5 h-5" />}
                showAllLink={"/notes"}
              />
            </CardDescription>
          </CardContent>
          <CardFooter>
            <Link
              to="/logout"
              className={buttonVariants({ variant: "outline" })}
            >
              Logout
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AppSidebar;
