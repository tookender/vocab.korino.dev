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
  // dynamic keys selection
  const [leftKey, setLeftKey] = useState<string>("fr");
  const [rightKey, setRightKey] = useState<string>("de");
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
      const lsTapeStates = localStorage.getItem(LS_KEYS.tapeStates);

      const parsedData = lsData ? (JSON.parse(lsData) as Vocab[]) : [];
      setData(parsedData);
      setJsonInput(lsData ? JSON.stringify(parsedData, null, 2) : "");

      if (lsAnswers) setAnswers(JSON.parse(lsAnswers) as Answer[]);
      else setAnswers(parsedData.map(() => null));

      const initialTapeStates = (() => {
        if (!lsTapeStates) return initTapeStates(parsedData.length);
        try {
          const parsedTape = JSON.parse(lsTapeStates) as TapeState[];
          if (parsedTape.length !== parsedData.length) return initTapeStates(parsedData.length);
          return parsedTape.map((state) => (state === "semi" ? "semi" : "covered"));
        } catch {
          return initTapeStates(parsedData.length);
        }
      })();
      setTapeStates(initialTapeStates);

      if (isCoverColumn(lsCover)) setCover(lsCover);

      if (lsSettings) {
        const s = JSON.parse(lsSettings) as ReturnType<typeof getDefaultSettings> & Partial<{
          tapeColor: TapeColorKey;
          tapeOpacityCovered: number;
          tapeOpacityPeek: number;
          theme: ThemeMode;
          leftKey: string;
          rightKey: string;
        }>;
        if (s.tapeColor) setTapeColor(s.tapeColor);
        if (typeof s.tapeOpacityCovered === "number") setTapeOpacityCovered(s.tapeOpacityCovered);
        if (typeof s.tapeOpacityPeek === "number") setTapeOpacityPeek(s.tapeOpacityPeek);
        if (s.theme === "light" || s.theme === "dark") setTheme(s.theme);
        if (typeof s.leftKey === "string") setLeftKey(s.leftKey);
        if (typeof s.rightKey === "string") setRightKey(s.rightKey);
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
    localStorage.setItem(LS_KEYS.tapeStates, JSON.stringify(tapeStates));
  }, [tapeStates]);

  useEffect(() => {
    const s = {
      tapeColor,
      tapeOpacityCovered,
      tapeOpacityPeek,
      theme,
      leftKey,
      rightKey,
    };
    localStorage.setItem(LS_KEYS.settings, JSON.stringify(s));
  }, [tapeColor, tapeOpacityCovered, tapeOpacityPeek, theme, leftKey, rightKey]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const colorPair = TAPE_COLORS[tapeColor];
  const availableKeys = useMemo(() => {
    const set = new Set<string>();
    for (const r of data) for (const k of Object.keys(r)) set.add(k);
    return Array.from(set);
  }, [data]);

  // ensure left/right keys are valid and different
  useEffect(() => {
    if (availableKeys.length === 0) return;
    if (!availableKeys.includes(leftKey)) setLeftKey(availableKeys[0]);
    if (!availableKeys.includes(rightKey)) {
      const fallback = availableKeys.find((k) => k !== leftKey) ?? availableKeys[0];
      setRightKey(fallback);
    }
    if (leftKey === rightKey) {
      const alt = availableKeys.find((k) => k !== leftKey);
      if (alt) setRightKey(alt);
    }
    // ensure cover is one of the two active keys
    if (cover !== leftKey && cover !== rightKey) setCover(leftKey);
  }, [availableKeys, leftKey, rightKey, cover]);

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
    localStorage.removeItem(LS_KEYS.tapeStates);
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

  const onSwitchTapes = () => {
    // toggle cover between the two current keys
    setCover((prev) => (prev === leftKey ? rightKey : leftKey));
    // when switching column we reset the tape states to cover
    setTapeStates(data.map(() => "covered"));
  };

  const onSwapColumns = () => {
    setLeftKey(rightKey);
    setRightKey(leftKey);
  };

  const knownCount = useMemo(() => knownUnknownCounts(answers).known, [answers]);
  const unknownCount = useMemo(() => knownUnknownCounts(answers).unknown, [answers]);

  const coverAllTapes = () => setTapeStates(coverAll(data.length));
  const uncoverAllTapes = () => setTapeStates(uncoverAll(data.length));
  const allCovered = useMemo(() => tapeStates.every((t) => (t ?? "covered") === "covered"), [tapeStates]);
  const onToggleCoverAll = () => {
    if (allCovered) uncoverAllTapes();
    else coverAllTapes();
  };

  return (
  <main className="min-h-dvh">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <HeaderBar
          onOpenJson={openJson}
          onClearAnswers={clearAnswers}
          onResetAll={openConfirm}
          onOpenSettings={openSettings}
        />

        <StatsBar
          total={data.length}
          known={knownCount}
          unknown={unknownCount}
          allCovered={allCovered}
          onToggleCoverAll={onToggleCoverAll}
          onSwapColumns={onSwapColumns}
          onSwitchTapes={onSwitchTapes}
        />

        <VocabTable
          data={data}
          cover={cover}
          leftKey={leftKey}
          rightKey={rightKey}
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
