"use client";

import { X } from "lucide-react";

type Props = {
  open: boolean;
  anim: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  anim,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;
  return (
    <div
      className={`fixed inset-0 z-[97] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
        anim ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div
        className={`w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900/95 shadow-2xl transition-all duration-300 ${
          anim ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-1"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
          <h3 className="text-base font-medium">{title}</h3>
          <button
            onClick={onCancel}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/10 text-neutral-300 transition-colors duration-200 hover:bg-white/20 active:scale-95"
            aria-label="Close"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">
          {description && (
            <p className="mb-4 text-sm text-neutral-300">{description}</p>
          )}
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onCancel}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3.5 py-2 text-sm font-medium text-neutral-200 shadow-sm transition-colors duration-200 hover:bg-white/20 active:scale-[.99]"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="inline-flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-500/20 px-3.5 py-2 text-sm font-semibold text-red-200 shadow-sm transition-colors duration-200 hover:bg-red-500/30 active:scale-[.99]"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
