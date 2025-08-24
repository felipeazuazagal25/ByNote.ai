import { Note } from "./notes";
import { PaletteKey } from "~/lib/colorList";

export type Project = {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_archived: boolean;
  is_shared: boolean;
  ui_color: PaletteKey;
  ui_icon: string;
  ui_theme: string;
  ui_font: string;
  created_at: Date;
  updated_at: Date;
  projects_tags: any[];
  notes: Note[];
  tags: any[];
};
