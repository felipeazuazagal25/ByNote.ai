import { forwardRef, useState, useEffect, useImperativeHandle } from "react";

import { Extension } from "@tiptap/core";
import Suggestion, { SuggestionOptions } from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import tippy, { Instance as TippyInstance } from "tippy.js";
import "tippy.js/dist/tippy.css";
import { combineArrays } from "~/utils/arrays";
import { headings } from "./slashCommandOptions/headings";
import { lists } from "./slashCommandOptions/lists";
import { elements } from "./slashCommandOptions/elements";

interface CommandItem {
  title: string;
  command: (props: { editor: any; range: any; update: any }) => void;
}

interface CommandListItem {
  categoryTitle: string;
  options: CommandItem[];
}

export interface CommandListHandle {
  onKeyDown: (event: KeyboardEvent) => boolean;
}

const CommandList = forwardRef<
  CommandListHandle,
  {
    items: CommandListItem[];
    command: (item: CommandItem) => void;
  }
>(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // const selectItem = (index: number) => {
  //   const item = items[index];
  //   if (item) {
  //     command(item);
  //   }
  // };

  // Expose key handling to parent
  useImperativeHandle(ref, () => ({
    onKeyDown: (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        setSelectedIndex((selectedIndex + 1) % items.length);
        return true;
      }
      if (event.key === "ArrowUp") {
        setSelectedIndex((selectedIndex - 1 + items.length) % items.length);
        return true;
      }
      if (event.key === "Enter") {
        // selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }));

  return (
    <div className="bg-white dark:bg-black border rounded shadow-md py-1 px-1 min-w-36">
      {items.length ? (
        items.map((item) => (
          <>
            <div className="text-gray-400 dark:text-gray-500 p-1 font-bold ">
              {item.categoryTitle}
            </div>
            {item.options.map((item, index) => (
              <button
                key={index}
                className={`text-black dark:text-white  text-sm block w-full text-left px-3 py-1 rounded ${
                  index === selectedIndex
                    ? "bg-gray-200 dark:bg-gray-800"
                    : "hover:bg-gray-100 dark:hover:bg-gray-900"
                }`}
                // onClick={() => selectItem(index)}
              >
                {item.title}
              </button>
            ))}
          </>
        ))
      ) : (
        <div className="px-2 py-1 text-gray-400">No results</div>
      )}
    </div>
  );
});

const SlashCommand = Extension.create({
  name: "slash-command",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range });
        },
        items: ({ query }: { query: string }) => {
          const commandOptions: CommandListItem[] = [
            {
              ...headings,
              options: headings.options.filter((item: any) =>
                item.title.toLowerCase().includes(query.toLowerCase())
              ),
            },
            {
              ...lists,
              options: lists.options.filter((item: any) =>
                item.title.toLowerCase().includes(query.toLowerCase())
              ),
            },
            {
              ...elements,
              options: elements.options.filter((item: any) =>
                item.title.toLowerCase().includes(query.toLowerCase())
              ),
            },
          ];

          return commandOptions;
        },
        render: () => {
          let component: ReactRenderer | null = null;
          let popup: TippyInstance[] = [];

          return {
            onStart: (props: any) => {
              component = new ReactRenderer(CommandList, {
                props,
                editor: props.editor,
              });

              popup = tippy("body", {
                getReferenceClientRect: props.clientRect as any,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
                arrow: false,
              });
            },
            onUpdate(props: any) {
              component?.updateProps(props);
              popup[0].setProps({
                getReferenceClientRect: props.clientRect,
              });
            },
            onKeyDown(props: any) {
              const ref = component?.ref as unknown as
                | CommandListHandle
                | undefined;
              if (ref?.onKeyDown(props.event)) {
                return true;
              }

              if (props.event.key === "Escape") {
                popup[0].hide();
                return true;
              }

              return false;
            },
            onExit() {
              popup[0].destroy();
              component?.destroy();
            },
          };
        },
      } as Partial<SuggestionOptions<CommandListItem>>,
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

export default SlashCommand;
