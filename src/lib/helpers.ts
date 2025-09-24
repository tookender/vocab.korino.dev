import type {
  Vocab,
  Answer,
  CoverColumn,
  Settings,
  TapeState,
  TapeColorKey,
  ThemeMode,
} from "./types";
import { LS_KEYS } from "./constants";

// json parsing and validation

export function parseVocabJson(input: string): Vocab[] {
  const parsed = JSON.parse(input);
  if (!Array.isArray(parsed)) throw new Error("JSON must be an array");

  return parsed.map((row: unknown, idx: number) => {
    if (!row || typeof row !== "object")
      throw new Error(`Row ${idx + 1} is not an object`);

    const r = row as Record<string, unknown>;
    const stringsOnly: Record<string, string> = {};
    for (const [k, v] of Object.entries(r)) {
      if (typeof v === "string") stringsOnly[k] = v;
    }
    const keys = Object.keys(stringsOnly);
    if (keys.length < 2)
      throw new Error(`Row ${idx + 1} must contain at least two string fields`);
    return stringsOnly as Vocab;
  });
}

export function loadFromStorage<T = unknown>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function saveToStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorageKeys(keys: string[]) {
  for (const k of keys) localStorage.removeItem(k);
}

export function initTapeStates(len: number): TapeState[] {
  return Array.from({ length: len }, () => "covered");
}

export function cycleTapeState(curr: TapeState | undefined): TapeState {
  return (curr ?? "covered") === "covered" ? "semi" : "covered";
}

export function knownUnknownCounts(answers: Answer[]) {
  const known = answers.filter((a) => a === "known").length;
  const unknown = answers.filter((a) => a === "unknown").length;
  return { known, unknown };
}

export function getDefaultSettings(): Required<
  Pick<Settings, "tapeOpacityCovered" | "tapeOpacityPeek" | "tapeColor" | "theme">
> {
  return { tapeColor: "green", tapeOpacityCovered: 1, tapeOpacityPeek: 0.1, theme: "dark" };
}

export function sanitizeOpacity(value: number) {
  const v = Math.min(100, Math.max(0, Math.ceil(value / 5) * 5));
  return v / 100;
}

export function isCoverColumn(value: unknown): value is CoverColumn {
  return typeof value === "string" && value.length > 0;
}

export function isTapeColorKey(value: unknown): value is TapeColorKey {
  return typeof value === "string" && ([
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "indigo",
    "violet",
  ] as const).includes(value as TapeColorKey);
}

export function isSecretCommand(input: string) {
  return input.trim().toLowerCase() === "secret website";
}

export function coverAll(len: number): TapeState[] {
  return Array.from({ length: len }, () => "covered");
}

export function uncoverAll(len: number): TapeState[] {
  return Array.from({ length: len }, () => "semi");
}

export { LS_KEYS };

export function applyTheme(theme: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
}
