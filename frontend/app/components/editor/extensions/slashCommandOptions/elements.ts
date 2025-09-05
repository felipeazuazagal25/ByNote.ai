export const elements = {
  categoryTitle: "Elements",
  options: [
    {
      title: "Expandible Section",
      command: ({ editor, range }: any) => {
        const { state, view } = editor;
        const { $from } = state.selection;

        const currentBlock = $from.node($from.depth);
        const currentText = currentBlock.textContent.replace("/", "");
        const posAfter = $from.end();
        let endPosition = $from.end();
        if (currentText.trim().length > 0) {
          // Insert a hard break or paragraph after current block
          editor
            .chain()
            .focus()
            .insertContentAt(posAfter, { type: "paragraph" })
            .run();

          // Move the cursor to the newly inserted paragraph
          endPosition = editor.state.selection.$from.end();
          editor.commands.setTextSelection(endPosition);
        }

        // editor.chain().focus().deleteRange(range).setDetails().run();

        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent({
            type: "details",
            attrs: { open: true },
            content: [
              {
                type: "detailsSummary",
                // Start with no content or a placeholder
                content: [],
              },
              {
                type: "detailsContent",
                content: [
                  {
                    type: "paragraph",
                    content: [], // empty paragraph is allowed
                  },
                ],
              },
            ],
          })
          .run();

        const newState = editor.state;
        const { from } = state.selection;

        // The first child of details is detailsSummary
        const detailsNode = state.doc.nodeAt(from);
        const summaryPos = endPosition;
        console.log("summaryPos", summaryPos);
        editor.commands.setTextSelection(summaryPos);
      },
    },
    {
      title: "Quote",
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleBlockquote().run();
      },
    },
  ],
};
