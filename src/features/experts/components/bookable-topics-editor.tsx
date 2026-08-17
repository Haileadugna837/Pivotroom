"use client";

import { useState } from "react";

export type BookableTopicDraft = {
  title: string;
  description: string;
  expertiseTopicId: string;
  industryId: string | null;
};

export function BookableTopicsEditor({
  topics,
  onChange,
  expertiseOptions,
  industryOptions,
  min,
  max,
}: {
  topics: BookableTopicDraft[];
  onChange: (topics: BookableTopicDraft[]) => void;
  expertiseOptions: { id: string; name: string }[];
  industryOptions: { id: string; name: string }[];
  min: number;
  max: number;
}) {
  const [draft, setDraft] = useState<BookableTopicDraft>({
    title: "",
    description: "",
    expertiseTopicId: expertiseOptions[0]?.id ?? "",
    industryId: null,
  });

  function addTopic() {
    if (!draft.title.trim() || !draft.description.trim() || !draft.expertiseTopicId) return;
    if (topics.length >= max) return;
    onChange([...topics, { ...draft, title: draft.title.trim(), description: draft.description.trim() }]);
    setDraft({ title: "", description: "", expertiseTopicId: expertiseOptions[0]?.id ?? "", industryId: null });
  }

  function removeTopic(index: number) {
    onChange(topics.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-black/50 dark:text-white/50">
        {topics.length} of {max} added{min > 0 ? ` (minimum ${min})` : ""}
      </p>

      {topics.length > 0 && (
        <ul className="flex flex-col gap-2">
          {topics.map((t, index) => (
            <li key={index} className="rounded-md border border-black/10 p-3 text-sm dark:border-white/15">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{t.title}</p>
                  <p className="mt-0.5 text-black/60 dark:text-white/60">{t.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeTopic(index)}
                  className="shrink-0 text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {topics.length < max && expertiseOptions.length > 0 && (
        <div className="flex flex-col gap-2 rounded-md border border-black/10 p-3 dark:border-white/15">
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="Topic title (e.g. Build My Go-to-Market Strategy)"
            className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
          />
          <textarea
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            rows={2}
            placeholder="Short description of what you'll help with"
            className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
          />
          <div className="flex flex-wrap gap-2">
            <select
              value={draft.expertiseTopicId}
              onChange={(e) => setDraft({ ...draft, expertiseTopicId: e.target.value })}
              className="flex-1 rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
            >
              {expertiseOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
            {industryOptions.length > 0 && (
              <select
                value={draft.industryId ?? ""}
                onChange={(e) => setDraft({ ...draft, industryId: e.target.value || null })}
                className="flex-1 rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
              >
                <option value="">Any industry (optional)</option>
                {industryOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <button
            type="button"
            onClick={addTopic}
            className="w-fit rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
          >
            Add topic
          </button>
        </div>
      )}
      {expertiseOptions.length === 0 && (
        <p className="text-sm text-amber-700 dark:text-amber-500">
          Select your specific expertise first — bookable topics are tagged to one of your expertise areas.
        </p>
      )}
    </div>
  );
}
