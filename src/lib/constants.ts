import type { TapeColorKey } from "./types";

// local storage keys
export const LS_KEYS = {
  data: "vocab-trainer:data",
  answers: "vocab-trainer:answers",
  cover: "vocab-trainer:cover",
  settings: "vocab-trainer:settings",
  tapeStates: "vocab-trainer:tape-states",
} as const;

export const TAPE_COLORS: Record<
  TapeColorKey,
  { light: [number, number, number]; dark: [number, number, number] }
> = {
  red: {
    light: [239, 68, 68], // rose-500
    dark: [190, 18, 60], // rose-700
  },
  orange: {
    light: [249, 115, 22], // orange-500
    dark: [194, 65, 12], // orange-700
  },
  yellow: {
    light: [234, 179, 8], // yellow-500
    dark: [161, 98, 7], // yellow-700
  },
  green: {
    light: [16, 185, 129], // emerald-500
    dark: [5, 150, 105], // emerald-600
  },
  blue: {
    light: [59, 130, 246], // blue-500
    dark: [29, 78, 216], // blue-700
  },
  indigo: {
    light: [99, 102, 241], // indigo-500
    dark: [67, 56, 202], // indigo-700
  },
  violet: {
    light: [139, 92, 246], // violet-500
    dark: [109, 40, 217], // violet-700
  },
};

export const rgba = (rgb: [number, number, number], a = 1) =>
  `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${a})`;

export const rgbStr = (rgb: [number, number, number]) =>
  `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
