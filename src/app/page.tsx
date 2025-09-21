"use client";

import { useEffect, useMemo, useState } from "react";
import type { Vocab, CoverColumn, TapeState, TapeColorKey, Answer, ThemeMode } from "@/lib/types";
import { LS_KEYS, TAPE_COLORS } from "@/lib/constants";
import {
  parseVocabJson,
  initTapeStates,
  cycleTapeState,
  knownUnknownCounts,
  getDefaultSettings,
  sanitizeOpacity,
  isCoverColumn,
  isSecretCommand,
  coverAll,
  uncoverAll,
} from "@/lib/helpers";
import HeaderBar from "@/components/HeaderBar";
import StatsBar from "@/components/StatsBar";
import VocabTable from "@/components/VocabTable";
import JsonLoaderDrawer from "@/components/JsonLoaderDrawer";
import SettingsModal from "@/components/SettingsModal";
import SecretBrowserModal from "@/components/SecretBrowserModal";
import ConfirmModal from "@/components/ConfirmModal";

export default function Page() {
  const [data, setData] = useState<Vocab[]>([]);
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cover, setCover] = useState<CoverColumn>("fr");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [tapeStates, setTapeStates] = useState<TapeState[]>([]);
  // settings
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [settingsAnim, setSettingsAnim] = useState(false);
  const [tapeColor, setTapeColor] = useState<TapeColorKey>("green");
  const openSettings = () => {
    setSettingsVisible(true);
    requestAnimationFrame(() => setSettingsAnim(true));
  };
  const closeSettings = () => {
    setSettingsAnim(false);
    setTimeout(() => setSettingsVisible(false), 250);
  };
  const [tapeOpacityCovered, setTapeOpacityCovered] = useState<number>(1);
  const [tapeOpacityPeek, setTapeOpacityPeek] = useState<number>(0.1);
  const [theme, setTheme] = useState<ThemeMode>("dark");
  // secret embed browser (games)
  const [browserOpen, setBrowserOpen] = useState(false);
  // moved to SecretBrowserModal internal state
  // json loader drawer animation
  const [jsonVisible, setJsonVisible] = useState(false);
  const [jsonAnim, setJsonAnim] = useState(false);

  // confirm reset modal
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmAnim, setConfirmAnim] = useState(false);

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
      const lsCover = localStorage.getItem(LS_KEYS.cover);
  const lsSettings = localStorage.getItem(LS_KEYS.settings);

      if (lsData) {
        const parsed = JSON.parse(lsData) as Vocab[];
        setData(parsed);
        setJsonInput(JSON.stringify(parsed, null, 2));
        setTapeStates(initTapeStates(parsed.length));
      } else {
        setData([]);
        setJsonInput("");
        setTapeStates([]);
      }

      if (lsAnswers) setAnswers(JSON.parse(lsAnswers) as Answer[]);
      else setAnswers((lsData ? (JSON.parse(lsData) as Vocab[]) : []).map(() => null));

      if (isCoverColumn(lsCover)) setCover(lsCover);

      if (lsSettings) {
        const s = JSON.parse(lsSettings) as ReturnType<typeof getDefaultSettings> & Partial<{
          tapeColor: TapeColorKey;
          tapeOpacityCovered: number;
          tapeOpacityPeek: number;
          theme: ThemeMode;
        }>;
        if (s.tapeColor) setTapeColor(s.tapeColor);
        if (typeof s.tapeOpacityCovered === "number") setTapeOpacityCovered(s.tapeOpacityCovered);
        if (typeof s.tapeOpacityPeek === "number") setTapeOpacityPeek(s.tapeOpacityPeek);
        if (s.theme === "light" || s.theme === "dark") setTheme(s.theme);
      }
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

  useEffect(() => {
    const s = {
      tapeColor,
      tapeOpacityCovered,
      tapeOpacityPeek,
      theme,
    };
    localStorage.setItem(LS_KEYS.settings, JSON.stringify(s));
  }, [tapeColor, tapeOpacityCovered, tapeOpacityPeek, theme]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const colorPair = TAPE_COLORS[tapeColor];

  // validate and apply the json data
  const onApplyJson = () => {
    setError(null);
	// secret embedded browser
    if (isSecretCommand(jsonInput)) {
      setBrowserOpen(true);
      closeJson();
      return;
    }
    try {
      const normalized: Vocab[] = parseVocabJson(jsonInput);
      setData(normalized);
      setAnswers(normalized.map(() => null));
      setTapeStates(initTapeStates(normalized.length));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  };

  const clearAnswers = () => {
    setAnswers(data.map(() => null));
  };

  const openConfirm = () => {
    setConfirmVisible(true);
    requestAnimationFrame(() => setConfirmAnim(true));
  };

  const closeConfirm = () => {
    setConfirmAnim(false);
    setTimeout(() => setConfirmVisible(false), 250);
  };

  const resetAll = () => {
    localStorage.removeItem(LS_KEYS.data);
    localStorage.removeItem(LS_KEYS.answers);
    localStorage.removeItem(LS_KEYS.cover);
    setData([]);
    setJsonInput("");
    setAnswers([]);
    setCover("fr");
    setTapeStates([]);
  };

  const cycleTape = (rowIdx: number) => {
    setTapeStates((prev) => {
      const next = [...prev];
      next[rowIdx] = cycleTapeState(next[rowIdx]);
      return next;
    });
  };

  const onChangeCover = (value: CoverColumn) => {
    setCover(value);
    // when switching column we reset the tape states to cover
    setTapeStates(data.map(() => "covered"));
  };

  const knownCount = useMemo(() => knownUnknownCounts(answers).known, [answers]);
  const unknownCount = useMemo(() => knownUnknownCounts(answers).unknown, [answers]);

  const coverAllTapes = () => setTapeStates(coverAll(data.length));
  const uncoverAllTapes = () => setTapeStates(uncoverAll(data.length));

  return (
  <main className="min-h-dvh">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <HeaderBar
          cover={cover}
          onChangeCover={onChangeCover}
          onOpenJson={openJson}
          onClearAnswers={clearAnswers}
          onResetAll={openConfirm}
          onOpenSettings={openSettings}
          tapeColor={tapeColor}
        />

        <StatsBar
          total={data.length}
          known={knownCount}
          unknown={unknownCount}
          onUncoverAll={uncoverAllTapes}
          onCoverAll={coverAllTapes}
        />

        <VocabTable
          data={data}
          cover={cover}
          answers={answers}
          setAnswers={setAnswers}
          tapeStates={tapeStates}
          onCycleTape={cycleTape}
          tapeOpacityCovered={tapeOpacityCovered}
          tapeOpacityPeek={tapeOpacityPeek}
          colorPair={colorPair}
        />
      </div>

      <SecretBrowserModal open={browserOpen} onClose={() => setBrowserOpen(false)} />

      <ConfirmModal
        open={confirmVisible}
        anim={confirmAnim}
        title="Reset all data?"
        description="This will clear loaded JSON, answers, and cover settings. This action cannot be undone."
        confirmText="Reset"
        cancelText="Cancel"
        onConfirm={() => {
          resetAll();
          closeConfirm();
        }}
        onCancel={closeConfirm}
      />

      <JsonLoaderDrawer
        open={jsonVisible}
        anim={jsonAnim}
        jsonInput={jsonInput}
        setJsonInput={setJsonInput}
        error={error}
        setError={setError}
        onClose={closeJson}
        onApplyJson={onApplyJson}
        colorPair={colorPair}
      />

      <SettingsModal
        open={settingsVisible}
        anim={settingsAnim}
        tapeColor={tapeColor}
        setTapeColor={setTapeColor}
        tapeOpacityCovered={tapeOpacityCovered}
        setTapeOpacityCovered={(v) => setTapeOpacityCovered(sanitizeOpacity(v * 100))}
        tapeOpacityPeek={tapeOpacityPeek}
        setTapeOpacityPeek={(v) => setTapeOpacityPeek(sanitizeOpacity(v * 100))}
        theme={theme}
        setTheme={setTheme}
        onClose={closeSettings}
      />
    </main>
  );
}
