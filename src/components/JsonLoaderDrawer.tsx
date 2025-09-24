"use client";

import { Upload, X } from "lucide-react";
import { rgba, rgbStr } from "@/lib/constants";

type Props = {
  open: boolean;
  anim: boolean;
  jsonInput: string;
  setJsonInput: (v: string) => void;
  error: string | null;
  setError: (v: string | null) => void;
  onClose: () => void;
  onApplyJson: () => void;
  colorPair: { light: [number, number, number]; dark: [number, number, number] };
};

export default function JsonLoaderDrawer({
  open,
  anim,
  jsonInput,
  setJsonInput,
  error,
  setError,
  onClose,
  onApplyJson,
  colorPair,
}: Props) {
  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[90] flex items-stretch justify-end bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
        anim ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-xl border-l border-white/10 bg-neutral-900 shadow-2xl transition-transform duration-300 ${
          anim ? "translate-x-0" : "translate-x-full"
        } flex h-[100dvh] flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
          <h2 className="text-base font-medium">Paste JSON</h2>
          <button
            onClick={() => {
              setError(null);
              onClose();
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/10 text-neutral-300 transition-colors duration-200 hover:bg-white/20 active:scale-95"
            aria-label="Close"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
          <p className="text-xs text-neutral-400">
            Provide an array of objects with two or more string fields (e.g., en/de or fr/de). The field names are used as column labels.
          </p>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='[\n  { "en": "hello", "de": "hallo" },\n  { "fr": "bonjour", "de": "guten Tag" }\n]'
            className="min-h[12rem] flex-1 resize-y rounded-xl border border-white/10 bg-white/10 p-3 font-mono text-sm text-neutral-100 outline-none ring-emerald-500/30 transition focus:ring-2 min-h-[12rem]"
            spellCheck={false}
          />
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <div className="sticky bottom-0 -mx-4 mt-2 flex items-center justify-between gap-2 border-t border-white/10 bg-neutral-900/95 px-4 py-3">
            <button
              onClick={() => {
                setError(null);
                setJsonInput("");
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3.5 py-2 text-sm font-medium text-neutral-200 shadow-sm transition-colors duration-200 hover:bg-white/20 active:scale-[.99]"
            >
              Clear
            </button>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3.5 py-2 text-sm font-medium text-neutral-200 shadow-sm transition-colors duration-200 hover:bg-white/20 active:scale-[.99]"
              >
                Close
              </button>
              <button
                onClick={onApplyJson}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:brightness-110 active:scale-[.99]"
                style={{
                  backgroundColor: rgbStr(colorPair.light),
                  boxShadow: `0 10px 24px -10px ${rgba(colorPair.light, 0.7)}`,
                }}
              >
                <Upload className="h-4 w-4" /> Load Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
