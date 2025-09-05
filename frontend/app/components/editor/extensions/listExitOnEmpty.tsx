import { Extension } from "@tiptap/core";
import { TextSelection } from "prosemirror-state";

const ListExitOnEmpty = Extension.create({
  name: "listExitOnEmpty",

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { state, dispatch } = editor.view;
        const { selection, doc } = state;
        // console.log("detecting the backpsace");
        console.log("this is the state", state);

        // only care if it's a collapsed selection
        if (!selection.empty) return false;

        // List items are organized as <li><p>Texto</p></li>
        const { $from } = selection;
        const container = $from.parent; // Paragraph

        const parentNodePosition = Math.max(selection.$head.pos - 1, 0);
        const parentNode = doc.resolve(parentNodePosition).node();

        // console.log("this is the parent node", parentNode);
        // console.log("this is the parent", container);
        // check if current node is an empty list item
        if (
          parentNode.type.name === "listItem" &&
          container.content.size === 0
        ) {
          // replace with an empty paragraph
          const newParagraphNode = state.schema.nodes.paragraph.create();
          const tr = state.tr.replaceRangeWith(
            parentNodePosition - 1,
            parentNodePosition + 1,
            newParagraphNode
          );
          console.log("inside the if");

          // set cursor inside new paragraph
          const newSelection = TextSelection.create(
            tr.doc,
            parentNodePosition + 1
          );
          tr.setSelection(newSelection);

          dispatch(tr);
          return true;
        }

        return false;
      },
    };
  },
});

export default ListExitOnEmpty;
