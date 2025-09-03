export const elements = {
  categoryTitle: "Elements",
  options: [
    {
      title: "Quote",
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleBlockquote().run();
      },
    },
  ],
};
