import { Button } from "./button";

export type Shorcut = {
  OS: string;
  shortcut: string;
};

const ButtonWithShortcut = ({
  shortcuts,
  OS,
  className,
  variant,
  children,
  onClick,
}: {
  shortcuts: Shorcut[] | undefined;
  OS: string;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive";
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <Button
      className={`w-full relative ${className}`}
      size="default"
      variant={variant}
      onClick={onClick}
    >
      <div>{children}</div>{" "}
      <div className="absolute rounded-full px-2 py-1 text-right right-1 text-gray-400 font-sans">
        {shortcuts?.find((shortcut) => shortcut.OS === OS)?.shortcut}
      </div>{" "}
    </Button>
  );
};

export default ButtonWithShortcut;
