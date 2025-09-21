export type Vocab = { fr: string; de: string };
export type CoverColumn = "fr" | "de";
export type TapeState = "covered" | "semi";
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
};
