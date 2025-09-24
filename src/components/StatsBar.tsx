"use client";

import { Eye, EyeOff } from "lucide-react";

type Props = {
  total: number;
  known: number;
  unknown: number;
  allCovered: boolean;
  onToggleCoverAll: () => void;
};

export default function StatsBar({ total, known, unknown, allCovered, onToggleCoverAll }: Props) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-neutral-400">
      <span className="mr-4">Total: {total}</span>
      <span className="mr-4 text-emerald-400">Known: {known}</span>
      <span className="text-rose-400">Unknown: {unknown}</span>
      <div className="ml-2 inline-flex items-center gap-2">
        <button
          onClick={onToggleCoverAll}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-xs font-medium text-neutral-200 shadow-sm transition-colors duration-200 hover:bg-white/20 active:scale-[.99] backdrop-blur-md"
          title={allCovered ? "Uncover all tape (peek)" : "Cover all tape"}
        >
          {allCovered ? (
            <>
              <Eye className="h-3.5 w-3.5" /> Uncover all
            </>
          ) : (
            <>
              <EyeOff className="h-3.5 w-3.5" /> Cover all
            </>
          )}
        </button>
      </div>
    </div>
  );
}
