"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, X, Upload, RotateCcw, Trash2, EyeOff, ArrowLeft, Eye } from "lucide-react";

type Vocab = { fr: string; de: string };
type CoverColumn = "fr" | "de";
type TapeState = "covered" | "semi";

const LS_KEYS = {
  data: "vocab-trainer:data",
  answers: "vocab-trainer:answers",
  cover: "vocab-trainer:cover",
} as const;

export default function Page() {
  const [data, setData] = useState<Vocab[]>([]);
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cover, setCover] = useState<CoverColumn>("fr");
  const [answers, setAnswers] = useState<Array<"known" | "unknown" | null>>(
    []
  );
  const [tapeStates, setTapeStates] = useState<TapeState[]>([]);
  // secret embed browser (games)
  const [browserOpen, setBrowserOpen] = useState(false);
  const [browserUrl, setBrowserUrl] = useState<string>("");
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  // json loader drawer animation
  const [jsonVisible, setJsonVisible] = useState(false);
  const [jsonAnim, setJsonAnim] = useState(false);

  const openJson = () => {
    setJsonVisible(true);
    // start animation on next frame
    requestAnimationFrame(() => setJsonAnim(true));
  };

  const closeJson = () => {
    setJsonAnim(false);
    // unmount after transition
    setTimeout(() => setJsonVisible(false), 300);
  };

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const lsData = localStorage.getItem(LS_KEYS.data);
      const lsAnswers = localStorage.getItem(LS_KEYS.answers);
      const lsCover = localStorage.getItem(LS_KEYS.cover) as CoverColumn | null;

      if (lsData) {
        const parsed = JSON.parse(lsData) as Vocab[];
        setData(parsed);
        setJsonInput(JSON.stringify(parsed, null, 2));
        setTapeStates(parsed.map(() => "covered"));
      } else {
        setData([]);
        setJsonInput("");
        setTapeStates([]);
      }

      if (lsAnswers) setAnswers(JSON.parse(lsAnswers));
      else setAnswers((lsData ? JSON.parse(lsData) : []).map(() => null));

      if (lsCover === "fr" || lsCover === "de") setCover(lsCover);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.data, JSON.stringify(data));
  }, [data]);
  useEffect(() => {
    localStorage.setItem(LS_KEYS.answers, JSON.stringify(answers));
  }, [answers]);
  useEffect(() => {
    localStorage.setItem(LS_KEYS.cover, cover);
  }, [cover]);

  // validate and apply the json data
  const onApplyJson = () => {
    setError(null);
	// secret embedded browser
    const trimmed = jsonInput.trim().toLowerCase();
    if (trimmed === "secret website") {
      setBrowserOpen(true);
      setSelectedGame(null);
      setBrowserUrl("");
      closeJson();
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) throw new Error("JSON must be an array");
      const normalized: Vocab[] = parsed.map((row, idx) => {
        if (!row || typeof row !== "object")
          throw new Error(`Row ${idx + 1} is not an object`);
        if (typeof row.fr !== "string" || typeof row.de !== "string")
          throw new Error(`Row ${idx + 1} must have 'fr' and 'de' strings`);
        return { fr: row.fr, de: row.de };
      });
      setData(normalized);
      setAnswers(normalized.map(() => null));
      setTapeStates(normalized.map(() => "covered"));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  };

  const clearAnswers = () => {
    setAnswers(data.map(() => null));
  };

  const resetAll = () => {
    if (
      typeof window !== "undefined" &&
      window.confirm("Reset all data and answers? This cannot be undone.")
    ) {
      localStorage.removeItem(LS_KEYS.data);
      localStorage.removeItem(LS_KEYS.answers);
      localStorage.removeItem(LS_KEYS.cover);
      setData([]);
      setJsonInput("");
      setAnswers([]);
      setCover("fr");
      setTapeStates([]);
    }
  };

  const cycleTape = (rowIdx: number) => {
    setTapeStates((prev) => {
      const next = [...prev];
      const curr = next[rowIdx] ?? "covered";
      next[rowIdx] = curr === "covered" ? "semi" : "covered";
      return next;
    });
  };

  const onChangeCover = (value: CoverColumn) => {
    setCover(value);
    // when switching column we reset the tape states to cover
    setTapeStates(data.map(() => "covered"));
  };

  const knownCount = useMemo(
    () => answers.filter((a) => a === "known").length,
    [answers]
  );
  const unknownCount = useMemo(
    () => answers.filter((a) => a === "unknown").length,
    [answers]
  );

  // Global tape controls
  const coverAllTapes = () => setTapeStates(data.map(() => "covered" as TapeState));
  const uncoverAllTapes = () => setTapeStates(data.map(() => "semi" as TapeState));

  return (
    <main className="min-h-dvh bg-neutral-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Vocabulary Trainer</h1>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/10 p-1 text-sm shadow-sm backdrop-blur-md">
              <button
                className={`px-2.5 py-1 text-xs rounded-full transition-colors duration-200 ${
                  cover === "fr"
                    ? "bg-emerald-500 text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)]"
                    : "text-neutral-300 hover:text-white"
                }`}
                onClick={() => onChangeCover("fr")}
                aria-pressed={cover === "fr"}
              >
                Cover: FR
              </button>
              <button
                className={`px-2.5 py-1 text-xs rounded-full transition-colors duration-200 ${
                  cover === "de"
                    ? "bg-emerald-500 text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)]"
                    : "text-neutral-300 hover:text-white"
                }`}
                onClick={() => onChangeCover("de")}
                aria-pressed={cover === "de"}
              >
                Cover: DE
              </button>
            </div>

            <button
              onClick={openJson}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-sm font-medium text-neutral-200 shadow-sm transition-colors duration-200 hover:bg-white/20 active:scale-[.99] backdrop-blur-md"
              title="Open JSON loader"
            >
              <Upload className="h-4 w-4" /> Open JSON
            </button>

            <button
              onClick={clearAnswers}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-sm font-medium text-neutral-200 shadow-sm transition-colors duration-200 hover:bg-white/20 active:scale-[.99] backdrop-blur-md"
              title="Clear all answers"
            >
              <RotateCcw className="h-4 w-4" /> Clear answers
            </button>

            <button
              onClick={resetAll}
              className="inline-flex items-center gap-2 rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-1.5 text-sm font-semibold text-red-300 shadow-sm transition-colors duration-200 hover:bg-red-400/20 active:scale-[.99] backdrop-blur-md"
            >
              <Trash2 className="h-4 w-4" /> Reset all
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-neutral-400">
          <span className="mr-4">Total: {data.length}</span>
          <span className="mr-4 text-emerald-400">Known: {knownCount}</span>
          <span className="text-rose-400">Unknown: {unknownCount}</span>
          <div className="ml-2 inline-flex items-center gap-2">
            <button
              onClick={uncoverAllTapes}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-xs font-medium text-neutral-200 shadow-sm transition-colors duration-200 hover:bg-white/20 active:scale-[.99] backdrop-blur-md"
              title="Uncover all tape (peek)"
           >
              <Eye className="h-3.5 w-3.5" /> Uncover all
            </button>
            <button
              onClick={coverAllTapes}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-xs font-medium text-neutral-200 shadow-sm transition-colors duration-200 hover:bg-white/20 active:scale-[.99] backdrop-blur-md"
              title="Cover all tape"
            >
              <EyeOff className="h-3.5 w-3.5" /> Cover all
            </button>
          </div>
        </div>

        {/* JSON Input Drawer Triggered Above */}

        {/* Table */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-xl backdrop-blur-md">
          <div className="grid grid-cols-[1fr_1fr_auto] items-center border-b border-white/5 bg-white/5 px-4 py-3 text-sm font-semibold text-neutral-300">
            <div>FR</div>
            <div>DE</div>
            <div className="text-center">Know</div>
          </div>
          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center text-neutral-400">
              <p className="text-base">No data loaded</p>
              <p className="text-sm">Click <span className="font-medium text-emerald-400">Open JSON</span> at the top</p>
            </div>
          ) : (
          <ul className="divide-y divide-white/5">
            {data.map((row, idx) => {
              const tape = (tapeStates[idx] as TapeState | undefined) ?? "covered";
              const overlayOpacity = tape === "covered" ? 1 : 0.1; // never 0
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
                      onClick={() => cycleTape(idx)}
                      title={tape === "covered" ? "Click to peek" : "Click to cover"}
                      className="tape-overlay absolute z-20 rounded-md transition duration-300 hover:scale-[.995] cursor-pointer"
                      style={{
                        opacity: cover === "fr" ? overlayOpacity : 0,
                        pointerEvents: cover === "fr" ? "auto" : "none",
                        transform: cover === "fr" ? "translateX(0)" : "translateX(-12px)",
                        top: 8, right: 8, bottom: 8, left: 8,
                        background:
                          "repeating-linear-gradient( -40deg, rgba(16,185,129,1), rgba(16,185,129,1) 10px, rgba(5,150,105,1) 10px, rgba(5,150,105,1) 20px )",
                        boxShadow: "0 8px 24px -8px rgba(16,185,129,0.4)",
                        border: "1px solid rgba(16,185,129,0.65)",
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
                      onClick={() => cycleTape(idx)}
                      title={tape === "covered" ? "Click to peek" : "Click to cover"}
                      className="tape-overlay absolute z-20 rounded-md transition duration-300 hover:scale-[.995] cursor-pointer"
                      style={{
                        opacity: cover === "de" ? overlayOpacity : 0,
                        pointerEvents: cover === "de" ? "auto" : "none",
                        transform: cover === "de" ? "translateX(0)" : "translateX(12px)",
                        top: 8, right: 8, bottom: 8, left: 8,
                        background:
                          "repeating-linear-gradient( -40deg, rgba(16,185,129,1), rgba(16,185,129,1) 10px, rgba(5,150,105,1) 10px, rgba(5,150,105,1) 20px )",
                        boxShadow: "0 8px 24px -8px rgba(16,185,129,0.4)",
                        border: "1px solid rgba(16,185,129,0.65)",
                      }}
                    >
                      <span className="sr-only">Toggle tape</span>
                      {((cover === "de" ? overlayOpacity : 0) as number) > 0 && (
                        <EyeOff className="pointer-events-none absolute right-2 top-2 h-4 w-4 text-emerald-50/80" />
                      )}
                    </button>
                  </div>

                  {/* Know buttons */}
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
      </div>

      {/* Secret Browser Modal (Games) */}
      {browserOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative h-[90vh] w-[90vw] overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/95 shadow-2xl">
            {/* Top bar */}
            <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
              <div className="flex items-center gap-2">
                {selectedGame !== null && (
                  <button
                    onClick={() => {
                      setSelectedGame(null);
                      setBrowserUrl("");
                    }}
                    className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm font-medium text-neutral-200 hover:bg-white/20 active:scale-[.98]"
                  >
                    <ArrowLeft className="h-4 w-4" /> Games
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedGame(null);
                  setBrowserUrl("");
                  setBrowserOpen(false);
                }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/10 text-neutral-300 transition-colors duration-200 hover:bg-white/20 active:scale-95"
                aria-label="Close"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            {selectedGame === null ? (
              <div className="grid h-[calc(90vh-56px)] grid-cols-1 gap-2 overflow-auto p-3 auto-rows-min sm:grid-cols-2 md:grid-cols-3">
                {[
                  {
                    title: "Highway Traffic 🛣️",
                    url: "https://www.onlinegames.io/games/2022/unity/highway-traffic/index.html",
                  },
                  {
                    title: "Block Blast 💥",
                    url: "https://cloud.onlinegames.io/games/2024/unity3/block-blast/index-og.html",
                  },
                  {
                    title: "Jeep Racing 🚙",
                    url: "https://www.onlinegames.io/games/2023/freezenova.com/jeep-racing/index.html",
                  },
                  {
                    title: "time.is 🕛",
                    url: "https://time.is",
                  },
                ].map((g, i) => (
                  <button
                    key={g.title}
                    onClick={() => {
                      setSelectedGame(i);
                      setBrowserUrl(g.url);
                    }}
                    className="group flex flex-col gap-1.5 rounded-lg border border-white/10 bg-white/5 p-3 text-left text-neutral-200 shadow hover:bg-white/10"
                  >
                    <div className="text-xl font-semibold leading-tight">{g.title}</div>
                    <div className="truncate text-neutral-400">{g.url}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="h-[calc(90vh-56px)] w-full">
                {browserUrl ? (
                  <iframe
                    src={browserUrl}
                    className="h-full w-full pointer-events-auto touch-auto"
                    style={{ touchAction: "auto" }}
                    sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-downloads allow-top-navigation-by-user-activation"
                    allow="fullscreen; clipboard-read; clipboard-write; geolocation; gamepad; encrypted-media"
                  />
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}

      {/* JSON Loader Drawer */}
      {jsonVisible && (
        <div
          className={`fixed inset-0 z-[90] flex items-stretch justify-end bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
            jsonAnim ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeJson}
        >
          <div
            className={`relative w-full max-w-xl border-l border-white/10 bg-neutral-900 shadow-2xl transition-transform duration-300 ${
              jsonAnim ? "translate-x-0" : "translate-x-full"
            } flex h-[100dvh] flex-col`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
              <h2 className="text-base font-medium">Paste JSON</h2>
              <button
                onClick={() => {
                  setError(null);
                  closeJson();
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
                Provide an array of objects with keys &quot;fr&quot; and &quot;de&quot;.
              </p>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='[\n  { "fr": "bonjour", "de": "guten Tag" }\n]'
                className="min-h-[12rem] flex-1 resize-y rounded-xl border border-white/10 bg-white/10 p-3 font-mono text-sm text-neutral-100 outline-none ring-emerald-500/30 transition focus:ring-2"
                spellCheck={false}
              />
              {error && (
                <p className="text-sm text-rose-400">{error}</p>
              )}
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
                    onClick={closeJson}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3.5 py-2 text-sm font-medium text-neutral-200 shadow-sm transition-colors duration-200 hover:bg-white/20 active:scale-[.99]"
                  >
                    Close
                  </button>
                  <button
                    onClick={onApplyJson}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(16,185,129,0.7)] transition-colors duration-200 hover:bg-emerald-700 active:scale-[.99]"
                  >
                    <Upload className="h-4 w-4" /> Load Data
                  </button>
                </div>
              </div>
          </div>
        </div>
        </div>
      )}
    </main>
  );
}
