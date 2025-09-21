"use client";

import { Upload, RotateCcw, Trash2, Settings as SettingsIcon } from "lucide-react";
import type { CoverColumn, TapeColorKey } from "@/lib/types";
import { rgba, rgbStr, TAPE_COLORS } from "@/lib/constants";

type Props = {
  cover: CoverColumn;
  onChangeCover: (c: CoverColumn) => void;
  onOpenJson: () => void;
  onClearAnswers: () => void;
  onResetAll: () => void;
  onOpenSettings: () => void;
  tapeColor: TapeColorKey;
};

export default function HeaderBar({
  cover,
  onChangeCover,
  onOpenJson,
  onClearAnswers,
  onResetAll,
  onOpenSettings,
  tapeColor,
}: Props) {
  const colorPair = TAPE_COLORS[tapeColor];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-2xl font-semibold tracking-tight">Vocabulary Trainer</h1>

      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/10 p-1 text-sm shadow-sm backdrop-blur-md">
          <button
            className={`px-2.5 py-1 text-xs rounded-full transition-colors duration-200 ${
              cover === "fr" ? "text-white" : "text-neutral-300 hover:text-white"
            }`}
            onClick={() => onChangeCover("fr")}
            aria-pressed={cover === "fr"}
            style={
              cover === "fr"
                ? {
                    backgroundColor: rgbStr(colorPair.light),
                    boxShadow: `0 4px 14px ${rgba(colorPair.light, 0.35)}`,
                  }
                : undefined
            }
          >
            Cover: FR
          </button>
          <button
            className={`px-2.5 py-1 text-xs rounded-full transition-colors duration-200 ${
              cover === "de" ? "text-white" : "text-neutral-300 hover:text-white"
            }`}
            onClick={() => onChangeCover("de")}
            aria-pressed={cover === "de"}
            style={
              cover === "de"
                ? {
                    backgroundColor: rgbStr(colorPair.light),
                    boxShadow: `0 4px 14px ${rgba(colorPair.light, 0.35)}`,
                  }
                : undefined
            }
          >
            Cover: DE
          </button>
        </div>

        <button
          onClick={onOpenJson}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-sm font-medium text-neutral-200 shadow-sm transition-colors duration-200 hover:bg-white/20 active:scale-[.99] backdrop-blur-md"
          title="Open JSON loader"
        >
          <Upload className="h-4 w-4" /> Open JSON
        </button>

        <button
          onClick={onClearAnswers}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-sm font-medium text-neutral-200 shadow-sm transition-colors duration-200 hover:bg-white/20 active:scale-[.99] backdrop-blur-md"
          title="Clear all answers"
        >
          <RotateCcw className="h-4 w-4" /> Clear answers
        </button>

        <button
          onClick={onResetAll}
          className="inline-flex items-center gap-2 rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-1.5 text-sm font-semibold text-red-300 shadow-sm transition-colors duration-200 hover:bg-red-400/20 active:scale-[.99] backdrop-blur-md"
        >
          <Trash2 className="h-4 w-4" /> Reset all
        </button>

        <button
          onClick={onOpenSettings}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-sm font-medium text-neutral-200 shadow-sm transition-colors duration-200 hover:bg-white/20 active:scale-[.99] backdrop-blur-md"
          title="Settings"
        >
          <SettingsIcon className="h-4 w-4" /> Settings
        </button>
      </div>
    </div>
  );
}
