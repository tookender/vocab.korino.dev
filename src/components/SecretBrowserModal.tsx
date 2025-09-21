"use client";

import { useState } from "react";
import { ArrowLeft, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const GAMES = [
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
];

export default function SecretBrowserModal({ open, onClose }: Props) {
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [browserUrl, setBrowserUrl] = useState<string>("");

  if (!open) return null;

  return (
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
              onClose();
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
            {GAMES.map((g, i) => (
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
  );
}
