import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { useDarkMode } from "~/hooks/useDarkMode";

export const EmojiPickerPopover = ({
  isOpen,
  setIsOpen,
  onEmojiSelect,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onEmojiSelect: (emoji: any) => void;
}) => {
  const [selectedIcon, setSelectedIcon] = useState("📚");
  const isDark = useDarkMode();
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="">
          {selectedIcon}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-fit p-0"
        side="right"
        sideOffset={10}
        style={{ touchAction: "auto" }}
        onWheel={(e) => e.stopPropagation()}
      >
        <Picker
          data={data}
          theme={isDark ? "dark" : "light"}
          onEmojiSelect={(value: any) => {
            onEmojiSelect(value);
            setSelectedIcon(value.native);
          }}
          autoFocus={true}
          emojiSize={20}
          previewEmoji=":books:"
          previewPosition="none"
          perLine={8}
        />
      </PopoverContent>
    </Popover>
  );
};
