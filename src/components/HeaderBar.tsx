"use client";

import { Upload, RotateCcw, Trash2, Settings as SettingsIcon } from "lucide-react";
// no props from types needed here
// no color constants needed here after simplification

type Props = {
  onOpenJson: () => void;
  onClearAnswers: () => void;
  onResetAll: () => void;
  onOpenSettings: () => void;
};

export default function HeaderBar({
  onOpenJson,
  onClearAnswers,
  onResetAll,
  onOpenSettings,
}: Props) {

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-2xl font-semibold tracking-tight">Vocabulary Trainer</h1>

      <div className="flex flex-wrap items-center gap-2">
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
