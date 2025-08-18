export const palette = {
  bw: {
    mainLight: "#000000", // black for light mode
    mainDark: "#FFFFFF", // white for dark mode
    backgroundLight: "#F3F4F6",
    backgroundDark: "#1F2937",
  },
  gray: {
    mainLight: "#D1D5DB", // soft gray (lighter)
    mainDark: "#9CA3AF", // medium gray (visible on dark)
    backgroundLight: "#F9FAFB",
    backgroundDark: "#111827",
  },
  blue: {
    mainLight: "#93C5FD", // pastel blue
    mainDark: "#60A5FA", // softer medium blue
    backgroundLight: "#DBEAFE",
    backgroundDark: "#1E3A8A",
  },
  red: {
    mainLight: "#FCA5A5", // pastel red
    mainDark: "#F87171", // softer medium red
    backgroundLight: "#FEE2E2",
    backgroundDark: "#7F1D1D",
  },
  green: {
    mainLight: "#6EE7B7", // pastel green
    mainDark: "#34D399", // minty green
    backgroundLight: "#D1FAE5",
    backgroundDark: "#064E3B",
  },
  yellow: {
    mainLight: "#FDE68A", // pastel yellow
    mainDark: "#FBBF24", // golden pastel
    backgroundLight: "#FEF3C7",
    backgroundDark: "#78350F",
  },
  purple: {
    mainLight: "#C4B5FD", // lavender pastel
    mainDark: "#A78BFA", // softer purple
    backgroundLight: "#EDE9FE",
    backgroundDark: "#4C1D95",
  },
  pink: {
    mainLight: "#F9A8D4", // baby pink pastel
    mainDark: "#F472B6", // medium pink
    backgroundLight: "#FCE7F3",
    backgroundDark: "#6B0B3F",
  },
  cyan: {
    mainLight: "#67E8F9", // pastel cyan
    mainDark: "#22D3EE", // aqua pastel
    backgroundLight: "#CFFAFE",
    backgroundDark: "#083344",
  },
};

export type PaletteKey = keyof typeof palette;
