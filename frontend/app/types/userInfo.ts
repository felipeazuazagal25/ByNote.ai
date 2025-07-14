export type UserInfo = {
  id: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  first_name: string;
  last_name: string;
  default_workspace_id: string;
  default_project_id: string;
};
