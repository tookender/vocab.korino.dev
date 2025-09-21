"use client";

import { Check, X, EyeOff } from "lucide-react";
import type { Answer, CoverColumn, TapeState, Vocab } from "@/lib/types";
import { rgba } from "@/lib/constants";

type Props = {
  data: Vocab[];
  cover: CoverColumn;
  answers: Answer[];
  setAnswers: (updater: (prev: Answer[]) => Answer[]) => void;
  tapeStates: TapeState[];
  onCycleTape: (rowIdx: number) => void;
  colorPair: { light: [number, number, number]; dark: [number, number, number] };
  tapeOpacityCovered: number;
  tapeOpacityPeek: number;
};

export default function VocabTable({
  data,
  cover,
  answers,
  setAnswers,
  tapeStates,
  onCycleTape,
  colorPair,
  tapeOpacityCovered,
  tapeOpacityPeek,
}: Props) {
  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-xl backdrop-blur-md">
      <div className="grid grid-cols-[1fr_1fr_auto] items-center border-b border-white/5 bg-white/5 px-4 py-3 text-sm font-semibold text-neutral-300">
        <div>FR</div>
        <div>DE</div>
        <div className="text-center">Know</div>
      </div>
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center text-neutral-400">
          <p className="text-base">No data loaded</p>
          <p className="text-sm">
            Click <span className="font-medium text-emerald-400">Open JSON</span> at the top
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-white/5">
          {data.map((row, idx) => {
            const tape = (tapeStates[idx] as TapeState | undefined) ?? "covered";
            const overlayOpacity = tape === "covered" ? tapeOpacityCovered : tapeOpacityPeek;
            const answer = answers[idx] ?? null;

            return (
              <li
                key={idx}
                className="grid grid-cols-[1fr_1fr_auto] items-stretch transition hover:bg-white/5"
                style={{ animation: `fadeSlideUp 320ms ease-out both`, animationDelay: `${idx * 18}ms` }}
              >
                {/* FR cell */}
                <div className="relative px-4 py-3">
                  <div className="relative z-10 whitespace-pre-wrap leading-relaxed">{row.fr}</div>
                  <button
                    onClick={() => onCycleTape(idx)}
                    title={tape === "covered" ? "Click to peek" : "Click to cover"}
                    className="tape-overlay absolute z-20 rounded-md transition duration-300 hover:scale-[.995] cursor-pointer"
                    style={{
                      opacity: cover === "fr" ? overlayOpacity : 0,
                      pointerEvents: cover === "fr" ? "auto" : "none",
                      transform: cover === "fr" ? "translateX(0)" : "translateX(-12px)",
                      top: 8,
                      right: 8,
                      bottom: 8,
                      left: 8,
                      background: `repeating-linear-gradient(-40deg, ${rgba(colorPair.light)}, ${rgba(colorPair.light)} 10px, ${rgba(
                        colorPair.dark,
                        1
                      )} 10px, ${rgba(colorPair.dark, 1)} 20px)`,
                      boxShadow: `0 8px 24px -8px ${rgba(colorPair.light, 0.4)}`,
                      border: `1px solid ${rgba(colorPair.light, 0.65)}`,
                    }}
                  >
                    <span className="sr-only">Toggle tape</span>
                    {((cover === "fr" ? overlayOpacity : 0) as number) > 0 && (
                      <EyeOff className="pointer-events-none absolute right-2 top-2 h-4 w-4 text-emerald-50/80" />
                    )}
                  </button>
                </div>

                {/* DE cell */}
                <div className="relative px-4 py-3">
                  <div className="relative z-10 whitespace-pre-wrap leading-relaxed">{row.de}</div>
                  <button
                    onClick={() => onCycleTape(idx)}
                    title={tape === "covered" ? "Click to peek" : "Click to cover"}
                    className="tape-overlay absolute z-20 rounded-md transition duration-300 hover:scale-[.995] cursor-pointer"
                    style={{
                      opacity: cover === "de" ? overlayOpacity : 0,
                      pointerEvents: cover === "de" ? "auto" : "none",
                      transform: cover === "de" ? "translateX(0)" : "translateX(12px)",
                      top: 8,
                      right: 8,
                      bottom: 8,
                      left: 8,
                      background: `repeating-linear-gradient(-40deg, ${rgba(colorPair.light)}, ${rgba(colorPair.light)} 10px, ${rgba(
                        colorPair.dark,
                        1
                      )} 10px, ${rgba(colorPair.dark, 1)} 20px)`,
                      boxShadow: `0 8px 24px -8px ${rgba(colorPair.light, 0.4)}`,
                      border: `1px solid ${rgba(colorPair.light, 0.65)}`,
                    }}
                  >
                    <span className="sr-only">Toggle tape</span>
                    {((cover === "de" ? overlayOpacity : 0) as number) > 0 && (
                      <EyeOff className="pointer-events-none absolute right-2 top-2 h-4 w-4 text-emerald-50/80" />
                    )}
                  </button>
                </div>

                {/* Know? buttons */}
                <div className="flex items-center justify-center gap-2 px-3">
                  <button
                    onClick={() =>
                      setAnswers((prev) => {
                        const next = [...prev];
                        next[idx] = prev[idx] === "known" ? null : "known";
                        return next;
                      })
                    }
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-emerald-300 transition-all duration-200 hover:bg-emerald-500/15 hover:shadow-[0_0_0_3px_rgba(16,185,129,0.18)] active:scale-95 ${
                      answer === "known"
                        ? "border-emerald-600/70 bg-emerald-900/40 shadow-[0_10px_20px_-10px_rgba(16,185,129,0.45)]"
                        : "border-white/10"
                    }`}
                    aria-pressed={answer === "known"}
                    title="Mark as known"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() =>
                      setAnswers((prev) => {
                        const next = [...prev];
                        next[idx] = prev[idx] === "unknown" ? null : "unknown";
                        return next;
                      })
                    }
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-rose-300 transition-all duration-200 hover:bg-rose-500/15 hover:shadow-[0_0_0_3px_rgba(244,63,94,0.18)] active:scale-95 ${
                      answer === "unknown"
                        ? "border-rose-600/70 bg-rose-900/40 shadow-[0_10px_20px_-10px_rgba(244,63,94,0.35)]"
                        : "border-white/10"
                    }`}
                    aria-pressed={answer === "unknown"}
                    title="Mark as unknown"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
