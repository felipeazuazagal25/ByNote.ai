import type { Project } from "./projects";

export type Workspace = {
  id: string;
  name: string;
  description: string;
  is_archived: boolean;
  is_shared: boolean;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  projects: Project[]; // Replace this for the top5 projects
  topNProjects: any[] | null;
  topNNotes: any[] | null;
  //   top5notes: any[] | null;
};
