import * as LucideIcons from "lucide-react";

export const iconList = Object.keys(LucideIcons)
  .filter((key) => /^[A-Z]/.test(key)) // only components
  .map((name) => ({
    name,
    Icon: (LucideIcons as any)[name],
  }));

// helper: render by name
export function getIconByName(name: string) {
  const Icon = (LucideIcons as any)[name];
  return Icon ? <Icon size={20} /> : null;
}
