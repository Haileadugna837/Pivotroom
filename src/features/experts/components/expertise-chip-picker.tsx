"use client";

import { useState } from "react";

type ExpertiseOption = { id: string; name: string };

export function ExpertiseChipPicker({
  options,
  selectedIds,
  onChange,
  min,
  max,
  onSuggest,
}: {
  options: ExpertiseOption[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  min: number;
  max: number;
  onSuggest?: (name: string) => void;
}) {
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggestText, setSuggestText] = useState("");

  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
      return;
    }
    if (selectedIds.length >= max) return;
    onChange([...selectedIds, id]);
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-pivot-muted">
        {selectedIds.length} of {max} selected{min > 0 ? ` (minimum ${min})` : ""}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const selected = selectedIds.includes(o.id);
          const disabled = !selected && selectedIds.length >= max;
          return (
            <button
              key={o.id}
              type="button"
              disabled={disabled}
              onClick={() => toggle(o.id)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                selected
                  ? "border-pivot-ink bg-pivot-ink text-pivot-paper"
                  : "border-pivot-line text-pivot-ink hover:bg-pivot-paper-2"
              }`}
            >
              {o.name}
            </button>
          );
        })}
      </div>
      {onSuggest && (
        <div>
          {!suggestOpen ? (
            <button
              type="button"
              onClick={() => setSuggestOpen(true)}
              className="text-xs text-pivot-muted underline"
            >
              Can&apos;t find what you&apos;re looking for? Suggest it
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={suggestText}
                onChange={(e) => setSuggestText(e.target.value)}
                placeholder="e.g. Influencer Marketing"
                className="rounded-md border border-pivot-line bg-pivot-paper px-3 py-1.5 text-sm text-pivot-ink"
              />
              <button
                type="button"
                onClick={() => {
                  if (!suggestText.trim()) return;
                  onSuggest(suggestText.trim());
                  setSuggestText("");
                  setSuggestOpen(false);
                }}
                className="rounded-md border border-pivot-line px-3 py-1.5 text-xs font-medium text-pivot-ink"
              >
                Submit suggestion
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
