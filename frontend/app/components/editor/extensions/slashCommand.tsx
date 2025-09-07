import {
  forwardRef,
  useState,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import { Extension } from "@tiptap/core";
import Suggestion, { SuggestionOptions } from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import tippy, { Instance as TippyInstance } from "tippy.js";
import "tippy.js/dist/tippy.css";
import { headings } from "./slashCommandOptions/headings";
import { lists } from "./slashCommandOptions/lists";
import { elements } from "./slashCommandOptions/elements";
import { combineArrays } from "./utils/combineArrays";

export interface CommandItem {
  title: string;
  command: (props: { editor: any; range: any; update: any }) => void;
  index?: number;
}

export interface CommandListItem {
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

  const selectItem = (index: number) => {
    const item: CommandItem =
      items
        .flatMap((category) => category.options)
        .find((item) => {
          return item.index === index;
        }) || items[0].options[0];
    if (item) {
      command(item);
    }
  };

  // Expose key handling to parent
  useImperativeHandle(ref, () => ({
    onKeyDown: (event: KeyboardEvent) => {
      const totalListItems = items.flatMap(
        (category) => category.options
      ).length;

      if (event.key === "ArrowDown") {
        setSelectedIndex((selectedIndex + 1) % totalListItems);
        return true;
      }
      if (event.key === "ArrowUp") {
        setSelectedIndex((selectedIndex - 1 + totalListItems) % totalListItems);
        return true;
      }
      if (event.key === "Enter") {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }));

  const selectedRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth", // or "auto" if you don’t want animation
      });
    }
  }, [selectedIndex]);

  return (
    <div className="bg-white dark:bg-dark-bg border rounded shadow-md py-1 px-1 w-60 h-72 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
      {items.length ? (
        items.map((item, index) => (
          <>
            <div
              className="text-gray-400 dark:text-gray-500 p-1 font-bold"
              key={index}
            >
              {item.categoryTitle}
            </div>
            {item.options.map((item) => (
              <button
                key={item.index}
                ref={item.index === selectedIndex ? selectedRef : null}
                className={`text-black dark:text-dark-text text-sm block w-full text-left px-3 py-1 rounded ${
                  item.index === selectedIndex
                    ? "bg-gray-200 dark:bg-gray-800"
                    : "hover:bg-gray-100 dark:hover:bg-gray-900"
                }`}
                onClick={() => selectItem(item.index || 0)}
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
          const commandOptions = combineArrays(query, [
            headings,
            lists,
            elements,
          ]);
          // console.log("this is command options", commandOptions);

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
