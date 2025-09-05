import { CommandListItem } from "../slashCommand";

export const combineArrays = (query: string, arrays: any[]) => {
  const commandOptions: CommandListItem[] = [];

  let currentIndex = 0; // Global Index for all sub-items (options)
  arrays.map((category) => {
    // Filter and add index to iterate over them
    const newCategory = {
      ...category,
      options: category.options
        ?.map((item: any) => {
          const newItem = { ...item, index: currentIndex };
          currentIndex += 1;
          return newItem;
        })
        .filter((item: any) =>
          item.title.toLowerCase().includes(query.toLowerCase())
        ),
    };
    commandOptions.push(newCategory);
  });

  return commandOptions;
};
