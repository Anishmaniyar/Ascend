"use client";

import { useState, useEffect, useRef } from "react";
import { X, Info } from "lucide-react";
import Button from "@/components/ui/Button";

export default function EditModal({
  open,
  onClose,
  onSave,
  label,
  description,
  value,
  inputType = "text",
  options = [],
  readOnly = false,
}) {
  const [draft, setDraft] = useState(value || "");
  const inputRef = useRef(null);

  // Reset draft when the modal opens with a new value
  useEffect(() => {
    if (open) {
      setDraft(value || "");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, value]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    onSave(draft);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-graphite/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative mx-4 w-full max-w-md rounded-2xl bg-ash p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-fog">
              <Info className="h-4 w-4 text-ember" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
                Update {label}
              </h2>
              <p className="mt-1 text-13 text-slate">{description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1 text-slate transition-colors hover:bg-fog hover:text-graphite"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mt-5 mb-6">
            {inputType === "textarea" ? (
              <textarea
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                readOnly={readOnly}
                rows={4}
                className="w-full rounded-lg border border-mist bg-fog px-4 py-3 text-15 text-graphite outline-none transition-colors placeholder:text-slate/50 focus:border-ember"
                placeholder={`Enter ${label.toLowerCase()}...`}
              />
            ) : inputType === "select" ? (
              <select
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                disabled={readOnly}
                className="w-full appearance-none rounded-lg border border-mist bg-fog px-4 py-3 text-15 text-graphite outline-none transition-colors focus:border-ember"
              >
                <option value="">Select...</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                ref={inputRef}
                type={
                  inputType === "url"
                    ? "url"
                    : inputType === "date"
                    ? "date"
                    : "text"
                }
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                readOnly={readOnly}
                className="w-full rounded-lg border border-mist bg-fog px-4 py-3 text-15 text-graphite outline-none transition-colors placeholder:text-slate/50 focus:border-ember"
                placeholder={readOnly ? "" : `Enter ${label.toLowerCase()}...`}
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            {!readOnly && (
              <Button type="submit" variant="primary">
                Save
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
