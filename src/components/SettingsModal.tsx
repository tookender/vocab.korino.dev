"use client";

import { X } from "lucide-react";
import type { TapeColorKey } from "@/lib/types";
import { rgba, rgbStr, TAPE_COLORS } from "@/lib/constants";

type Props = {
  open: boolean;
  anim: boolean;
  tapeColor: TapeColorKey;
  setTapeColor: (c: TapeColorKey) => void;
  tapeOpacityCovered: number;
  setTapeOpacityCovered: (v: number) => void;
  tapeOpacityPeek: number;
  setTapeOpacityPeek: (v: number) => void;
  onClose: () => void;
};

export default function SettingsModal({
  open,
  anim,
  tapeColor,
  setTapeColor,
  tapeOpacityCovered,
  setTapeOpacityCovered,
  tapeOpacityPeek,
  setTapeOpacityPeek,
  onClose,
}: Props) {
  if (!open) return null;

  const colorPair = TAPE_COLORS[tapeColor];

  return (
    <div
      className={`fixed inset-0 z-[95] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
        anim ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-xl rounded-2xl border border-white/10 bg-neutral-900/95 shadow-2xl transition-all duration-300 ${
          anim ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-1"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
          <h3 className="text-base font-medium">Settings</h3>
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/10 text-neutral-300 transition-colors duration-200 hover:bg-white/20 active:scale-95"
            aria-label="Close"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-4">
          {/* Tape colors */}
          <div>
            <label className="block text-sm font-medium text-neutral-200">Theme color</label>
            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-7">
              {([
                { key: "red", color: "#ef4444" },
                { key: "orange", color: "#f97316" },
                { key: "yellow", color: "#eab308" },
                { key: "green", color: "#10b981" },
                { key: "blue", color: "#3b82f6" },
                { key: "indigo", color: "#6366f1" },
                { key: "violet", color: "#8b5cf6" },
              ] as Array<{ key: TapeColorKey; color: string }>).map((c) => (
                <button
                  key={c.key}
                  onClick={() => setTapeColor(c.key)}
                  aria-label={c.key}
                  className={`flex items-center justify-center rounded-lg border p-3 transition ${
                    tapeColor === c.key
                      ? "border-white/30 bg-white/15"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                  title={c.key}
                >
                  <span className="sr-only capitalize">{c.key}</span>
                  <span
                    className="inline-block h-3 w-3 rounded-full shrink-0 ring-1 ring-white/30"
                    style={{ backgroundColor: c.color }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Opacity sliders */}
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-200">
                Covered opacity
                <span className="ml-2 text-neutral-400">{Math.round(tapeOpacityCovered * 100)}%</span>
              </label>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={Math.round(tapeOpacityCovered * 100)}
                onChange={(e) => setTapeOpacityCovered(Number(e.target.value) / 100)}
                className="w-full range-dark"
                style={{
                  background: `linear-gradient(${rgbStr(colorPair.light)}, ${rgbStr(colorPair.light)}) left center / ${Math.round(
                    tapeOpacityCovered * 100
                  )}% 6px no-repeat, linear-gradient(rgba(255,255,255,0.08), rgba(255,255,255,0.08)) left center / 100% 6px no-repeat`,
                  color: rgbStr(colorPair.light),
                  accentColor: rgbStr(colorPair.light),
                }}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-200">
                Peek opacity
                <span className="ml-2 text-neutral-400">{Math.round(tapeOpacityPeek * 100)}%</span>
              </label>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={Math.round(tapeOpacityPeek * 100)}
                onChange={(e) => setTapeOpacityPeek(Number(e.target.value) / 100)}
                className="w-full range-dark"
                style={{
                  background: `linear-gradient(${rgbStr(colorPair.light)}, ${rgbStr(colorPair.light)}) left center / ${Math.round(
                    tapeOpacityPeek * 100
                  )}% 6px no-repeat, linear-gradient(rgba(255,255,255,0.08), rgba(255,255,255,0.08)) left center / 100% 6px no-repeat`,
                  color: rgbStr(colorPair.light),
                  accentColor: rgbStr(colorPair.light),
                }}
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              onClick={() => {
                setTapeColor("green");
                setTapeOpacityCovered(1);
                setTapeOpacityPeek(0.1);
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3.5 py-2 text-sm font-medium text-neutral-200 shadow-sm transition-colors duration-200 hover:bg-white/20 active:scale-[.99]"
            >
              Reset to defaults
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:brightness-110 active:scale-[.99]"
              style={{
                backgroundColor: rgbStr(colorPair.light),
                boxShadow: `0 10px 24px -10px ${rgba(colorPair.light, 0.7)}`,
              }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
