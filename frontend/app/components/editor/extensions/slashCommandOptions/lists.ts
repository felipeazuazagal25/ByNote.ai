export const lists = {
  categoryTitle: "List Types",
  options: [
    {
      title: "Bullet List",
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
  ],
};
