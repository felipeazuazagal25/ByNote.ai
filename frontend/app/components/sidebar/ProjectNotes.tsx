import { Project } from "~/types/projects";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";
import { Link, NavLink } from "@remix-run/react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Separator } from "../ui/separator";
import type { Workspace } from "~/types/workspaces";

import { ChevronDown } from "lucide-react";

export const ProjectNotes = ({
  project,
  workspace,
}: {
  project: Project;
  workspace: Workspace;
}) => {
  // UI functions
  // const createObject = () => {
  //   if (categoryName === "Projects") {
  //     console.log("Creating project...");
  //   } else if (categoryName === "Notes") {
  //     console.log("Creating note...");
  //   } else {
  //     console.log("No object found.");
  //   }
  // };

  return (
    <>
      <Accordion
        type="single"
        collapsible
        className="w-full mt-2 px-2 rounded-"
        draggable
      >
        <AccordionItem value={`project-${project.id}`}>
          <AccordionTrigger className="py-1 min-w-0">
            <div className="flex items-center gap-x-2 flex-1 min-w-0 pr-1">
              {project.ui_icon && (
                <>
                  <div className="text-sm shrink-0">{project.ui_icon}</div>
                  <Separator orientation="vertical" className="h-4 shrink-0" />
                </>
              )}
              <div className="flex-1 min-w-0 truncate">{project.name}</div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="ml-2">
            <div className="flex flex-col border border-l-2 border-r-0 border-t-0 border-b-0 border-gray-400 pl-1">
              {project.notes.length > 0 ? (
                project.notes.map((note) => (
                  <ObjectNavButton
                    link={`/${workspace.slug}/${project.slug}/${note.id}`}
                    name={note.title}
                  />
                ))
              ) : (
                <div className="px-2 italic text-xs text-gray-500 py-2">
                  No notes to show.
                </div>
              )}
            </div>
            <div className="flex justify-start w-full">
              <Link
                to={`/${workspace.slug}/${project.slug}`}
                className={`text-xs h-4 mt-1 italic text-gray-400 dark:text-gray-600`}
              >
                See all
              </Link>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

const ObjectNavButton = ({
  link,
  name,
  icon,
}: {
  link: string;
  name: string;
  icon?: string;
}) => {
  return (
    <NavLink
      to={link}
      className={({ isActive }) => `${
        isActive && "bg-gray-100 dark:bg-gray-900 border-gray-200"
      } flex items-center justify-start gap-x-2 my-1 mx-1 text-sm py-1 px-1 rounded-md border border-transparent hover:border-gray-400 transition-all duration-150
  }`}
    >
      {({ isActive }) => (
        <>
          {/* <div className="text-sm">{icon}</div>
          <Separator orientation="vertical" className="h-4" /> */}
          <div className="truncate px-1">{name}</div>
        </>
      )}
    </NavLink>
  );
};
