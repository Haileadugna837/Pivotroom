"use client";

import { useMemo, useState } from "react";

type Industry = { id: string; name: string; search_keywords: string[] };
type IndustryGroup = { id: string; name: string; industries: Industry[] };
export type IndustrySelection = { industryId: string; experienceLevel: "experienced" | "highly_experienced" | null };

export function IndustryPicker({
  groups,
  selections,
  onChange,
  max,
  onSuggest,
}: {
  groups: IndustryGroup[];
  selections: IndustrySelection[];
  onChange: (selections: IndustrySelection[]) => void;
  max: number;
  onSuggest?: (name: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);

  const industryById = useMemo(() => {
    const map = new Map<string, Industry>();
    for (const g of groups) for (const i of g.industries) map.set(i.id, i);
    return map;
  }, [groups]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const results: { industry: Industry; groupName: string }[] = [];
    for (const g of groups) {
      for (const i of g.industries) {
        const haystack = [i.name, ...i.search_keywords].join(" ").toLowerCase();
        if (haystack.includes(q)) results.push({ industry: i, groupName: g.name });
      }
    }
    return results.slice(0, 20);
  }, [groups, query]);

  const selectedIds = selections.map((s) => s.industryId);
  const atMax = selectedIds.length >= max;

  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selections.filter((s) => s.industryId !== id));
      return;
    }
    if (atMax) return;
    onChange([...selections, { industryId: id, experienceLevel: null }]);
  }

  function setLevel(id: string, level: "experienced" | "highly_experienced" | null) {
    onChange(selections.map((s) => (s.industryId === id ? { ...s, experienceLevel: level } : s)));
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-black/50 dark:text-white/50">
        {selectedIds.length} of {max} industries selected
      </p>

      {groups.length === 0 ? (
        <p className="text-sm text-black/50 dark:text-white/50">
          No industries are set up yet — you can skip this step for now and add industries later from My Account.
        </p>
      ) : (
        <>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search industries"
            className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
          />

          {searchResults ? (
            <div className="flex flex-col gap-1">
              {searchResults.length === 0 && (
                <p className="text-sm text-black/40 dark:text-white/40">No matches.</p>
              )}
              {searchResults.map(({ industry, groupName }) => {
                const selected = selectedIds.includes(industry.id);
                return (
                  <button
                    key={industry.id}
                    type="button"
                    disabled={!selected && atMax}
                    onClick={() => toggle(industry.id)}
                    className={`flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm disabled:cursor-not-allowed disabled:opacity-40 ${
                      selected
                        ? "border-foreground bg-black/5 dark:bg-white/10"
                        : "border-black/10 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
                    }`}
                  >
                    <span>{industry.name}</span>
                    <span className="text-xs text-black/40 dark:text-white/40">{groupName}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {groups.map((g) => (
                <div key={g.id} className="rounded-md border border-black/10 dark:border-white/15">
                  <button
                    type="button"
                    onClick={() => setOpenGroupId(openGroupId === g.id ? null : g.id)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium"
                  >
                    <span>{g.name}</span>
                    <span className="text-xs text-black/40 dark:text-white/40">
                      {openGroupId === g.id ? "Hide" : "Show"}
                    </span>
                  </button>
                  {openGroupId === g.id && (
                    <div className="flex flex-wrap gap-2 border-t border-black/10 p-3 dark:border-white/15">
                      {g.industries.map((i) => {
                        const selected = selectedIds.includes(i.id);
                        return (
                          <button
                            key={i.id}
                            type="button"
                            disabled={!selected && atMax}
                            onClick={() => toggle(i.id)}
                            className={`rounded-full border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40 ${
                              selected
                                ? "border-foreground bg-foreground text-background"
                                : "border-black/10 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
                            }`}
                          >
                            {i.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {selectedIds.length > 0 && (
        <div className="flex flex-col gap-2 border-t border-black/10 pt-3 dark:border-white/15">
          <p className="text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">Selected</p>
          {selections.map((s) => (
            <div key={s.industryId} className="flex flex-wrap items-center gap-2 text-sm">
              <span className="flex-1">{industryById.get(s.industryId)?.name ?? s.industryId}</span>
              <select
                value={s.experienceLevel ?? ""}
                onChange={(e) =>
                  setLevel(s.industryId, (e.target.value || null) as "experienced" | "highly_experienced" | null)
                }
                className="rounded-md border border-black/10 px-2 py-1 text-xs dark:border-white/15"
              >
                <option value="">Experience level (optional)</option>
                <option value="experienced">Experienced</option>
                <option value="highly_experienced">Highly Experienced</option>
              </select>
              <button
                type="button"
                onClick={() => toggle(s.industryId)}
                className="text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {onSuggest && <IndustrySuggestBox onSuggest={onSuggest} />}
    </div>
  );
}

function IndustrySuggestBox({ onSuggest }: { onSuggest: (name: string) => void }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-fit text-xs text-black/50 underline dark:text-white/50"
      >
        Can&apos;t find your industry? Suggest it
      </button>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g. Furniture Manufacturing"
        className="rounded-md border border-black/10 px-3 py-1.5 text-sm dark:border-white/15"
      />
      <button
        type="button"
        onClick={() => {
          if (!text.trim()) return;
          onSuggest(text.trim());
          setText("");
          setOpen(false);
        }}
        className="rounded-md border border-black/10 px-3 py-1.5 text-xs font-medium dark:border-white/15"
      >
        Submit suggestion
      </button>
    </div>
  );
}
