export type Note = {
  title: string;
  text_content: string;
  rich_content: JSON;
  is_archived: boolean;
  is_shared: boolean;
  is_starred: boolean;
  is_pinned: boolean;
  slug: string;
  urlString: string;
  created_at: Date;
  updated_at: Date;
  tags: any[];
};
