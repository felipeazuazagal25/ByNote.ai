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

export const ProjectGroup = ({
  objects,
  categoryName,
  icon = null,
  showAllLink,
}: {
  objects: Project[] | any[];
  categoryName: "Projects" | "Notes";
  icon?: any;
  showAllLink: string;
}) => {
  // Usefull variables
  const objectsExistsAndNonZero = objects && objects.length > 0;

  // UI functions
  const createObject = () => {
    if (categoryName === "Projects") {
      console.log("Creating project...");
    } else if (categoryName === "Notes") {
      console.log("Creating note...");
    } else {
      console.log("No object found.");
    }
  };

  return (
    <>
      <Accordion
        type="single"
        collapsible
        className="w-full mt-4"
        defaultValue="item-1"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="py-1">
            <div className="flex justify-between items-center gap-x-2">
              <div>{icon}</div>
              <div>{categoryName}</div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="ml-2">
            {objectsExistsAndNonZero ? (
              <>
                <div className="flex flex-col border border-l-2 border-r-0 border-t-0 border-b-0 border-gray-400 pl-1">
                  {objects.map((object) => (
                    <ObjectNavButton
                      link={object.slug}
                      name={object.name}
                      icon={object.ui_icon}
                    />
                  ))}
                </div>
                <div className="flex justify-start w-full">
                  <Link
                    to={showAllLink}
                    className={`text-xs h-4 mt-1 italic text-gray-400 dark:text-gray-600`}
                  >
                    See all
                  </Link>
                </div>
              </>
            ) : (
              <div className="italic text-gray-400 dark:text-gray-600 ml-3 flex justify-between items-center">
                <div>No data to show.</div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 dark:text-gray-600"
                  onClick={createObject}
                >
                  <Plus />
                </Button>
              </div>
            )}
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
          <div className="text-sm">{icon}</div>
          <Separator orientation="vertical" className="h-4" />
          <div className="truncate ">{name}</div>
        </>
      )}
    </NavLink>
  );
};

export const NoteGroup = ({
  objects,
  categoryName,
  icon = null,
  showAllLink,
}: {
  objects: Project[] | any[];
  categoryName: "Projects" | "Notes";
  icon?: any;
  showAllLink: string;
}) => {
  // Usefull variables
  const objectsExistsAndNonZero = objects && objects.length > 0;
  console.log;

  return (
    <>
      <Accordion
        type="single"
        collapsible
        className="w-full mt-4"
        defaultValue="item-1"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="py-1">
            <div className="flex justify-between items-center gap-x-2">
              <div>{icon}</div>
              <div>{categoryName}</div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="ml-2">
            {objectsExistsAndNonZero ? (
              <>
                <div className="flex flex-col border border-l-2 border-r-0 border-t-0 border-b-0 border-gray-400 pl-1">
                  {objects.map((object) => (
                    <NoteNavButton link={object.slug} title={object.title} />
                  ))}
                </div>
              </>
            ) : (
              <div className="italic text-gray-400 dark:text-gray-600 ml-3 flex justify-between items-center">
                <div>No data to show.</div>
                {/* <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 dark:text-gray-600"
                  onClick={createObject}
                >
                  <Plus />
                </Button> */}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

const NoteNavButton = ({ link, title }: { link: string; title: string }) => {
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
          {/* <Separator orientation="vertical" className="h-4" /> */}
          <div className="truncate ">{title}</div>
        </>
      )}
    </NavLink>
  );
};
