// A vocab row can have arbitrary language keys, each mapped to a string.
export type Vocab = Record<string, string>;
export type CoverColumn = string;
export type TapeState = "covered" | "semi";
export type ThemeMode = "light" | "dark";
export type TapeColorKey =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "indigo"
  | "violet";

export type Answer = "known" | "unknown" | null;

export type Settings = {
  tapeColor?: TapeColorKey;
  tapeOpacityCovered?: number;
  tapeOpacityPeek?: number;
  theme?: ThemeMode;
  leftKey?: string;
  rightKey?: string;
};
