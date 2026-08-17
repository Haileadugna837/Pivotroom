"use client";

import { useActionState, useMemo, useState } from "react";
import {
  changePrimaryCategory,
  changeSecondaryCategory,
  updateIndustries,
  createBookableTopic,
  updateBookableTopic,
  toggleBookableTopicActive,
  deleteBookableTopic,
  reorderBookableTopics,
  type ExpertiseActionState,
} from "@/features/experts/server/expertise-actions";
import { CategoryCardPicker } from "@/features/experts/components/category-card-picker";
import { ExpertiseChipPicker } from "@/features/experts/components/expertise-chip-picker";
import { IndustryPicker, type IndustrySelection } from "@/features/experts/components/industry-picker";
import type { ExpertiseCategoryGroup, PendingChangeRequest } from "@/features/experts/server/expertise";
import type { IndustryGroupWithIndustries } from "@/features/experts/server/industries";
import type { BookableTopic } from "@/features/experts/server/bookable-topics";

const emptyActionState: ExpertiseActionState = {};

function Card({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

function PendingBanner() {
  return (
    <p className="mb-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
      A change is pending admin review — your current profile stays visible until then.
    </p>
  );
}

function PrimaryExpertiseCard({
  categoryTree,
  primaryCategoryId,
  primaryExpertiseIds,
  secondaryCategoryId,
  pendingRequest,
}: {
  categoryTree: ExpertiseCategoryGroup[];
  primaryCategoryId: string | null;
  primaryExpertiseIds: string[];
  secondaryCategoryId: string | null;
  pendingRequest: PendingChangeRequest | undefined;
}) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(changePrimaryCategory, emptyActionState);
  const [draftCategoryId, setDraftCategoryId] = useState<string | null>(primaryCategoryId);
  const [draftExpertiseIds, setDraftExpertiseIds] = useState<string[]>(primaryExpertiseIds);

  const category = categoryTree.find((c) => c.id === primaryCategoryId);
  const draftCategory = categoryTree.find((c) => c.id === draftCategoryId);
  const expertiseNames = category?.subcategories.filter((s) => primaryExpertiseIds.includes(s.id)).map((s) => s.name) ?? [];

  return (
    <Card
      title="Primary Expertise"
      action={
        !editing && (
          <button type="button" onClick={() => setEditing(true)} className="text-xs underline">
            Edit
          </button>
        )
      }
    >
      {pendingRequest && <PendingBanner />}
      {!editing ? (
        <div>
          <p className="text-sm font-medium">{category?.name ?? "Not set"}</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {expertiseNames.map((name) => (
              <span key={name} className="rounded-full bg-black/5 px-2.5 py-1 text-xs dark:bg-white/10">
                {name}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <form action={formAction} className="flex flex-col gap-3">
          <CategoryCardPicker
            categories={categoryTree}
            selectedId={draftCategoryId}
            excludeId={secondaryCategoryId}
            onSelect={(id) => {
              if (id !== draftCategoryId) setDraftExpertiseIds([]);
              setDraftCategoryId(id);
            }}
          />
          {draftCategory && (
            <ExpertiseChipPicker
              options={draftCategory.subcategories}
              selectedIds={draftExpertiseIds}
              onChange={setDraftExpertiseIds}
              min={2}
              max={6}
            />
          )}
          <input type="hidden" name="category_id" value={draftCategoryId ?? ""} />
          {draftExpertiseIds.map((id) => (
            <input key={id} type="hidden" name="expertise_ids" value={id} />
          ))}
          {state.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}
          {state.success && <p className="text-sm text-green-700 dark:text-green-500">{state.success}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-md bg-foreground px-4 py-2 text-xs font-medium text-background disabled:opacity-50"
            >
              {pending ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-md border border-black/10 px-4 py-2 text-xs dark:border-white/15"
            >
              Close
            </button>
          </div>
        </form>
      )}
    </Card>
  );
}

function SecondaryExpertiseCard({
  categoryTree,
  primaryCategoryId,
  secondaryCategoryId,
  secondaryExpertiseIds,
  pendingRequest,
}: {
  categoryTree: ExpertiseCategoryGroup[];
  primaryCategoryId: string | null;
  secondaryCategoryId: string | null;
  secondaryExpertiseIds: string[];
  pendingRequest: PendingChangeRequest | undefined;
}) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(changeSecondaryCategory, emptyActionState);
  const [draftCategoryId, setDraftCategoryId] = useState<string | null>(secondaryCategoryId);
  const [draftExpertiseIds, setDraftExpertiseIds] = useState<string[]>(secondaryExpertiseIds);

  const category = categoryTree.find((c) => c.id === secondaryCategoryId);
  const draftCategory = categoryTree.find((c) => c.id === draftCategoryId);
  const expertiseNames =
    category?.subcategories.filter((s) => secondaryExpertiseIds.includes(s.id)).map((s) => s.name) ?? [];

  return (
    <Card
      title="Secondary Expertise"
      action={
        !editing &&
        secondaryCategoryId && (
          <button type="button" onClick={() => setEditing(true)} className="text-xs underline">
            Edit
          </button>
        )
      }
    >
      {pendingRequest && <PendingBanner />}
      {!editing && !secondaryCategoryId && (
        <button type="button" onClick={() => setEditing(true)} className="text-sm underline">
          + Add secondary expertise
        </button>
      )}
      {!editing && secondaryCategoryId && (
        <div>
          <p className="text-sm font-medium">{category?.name}</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {expertiseNames.map((name) => (
              <span key={name} className="rounded-full bg-black/5 px-2.5 py-1 text-xs dark:bg-white/10">
                {name}
              </span>
            ))}
          </div>
        </div>
      )}
      {editing && (
        <form action={formAction} className="flex flex-col gap-3">
          <CategoryCardPicker
            categories={categoryTree}
            selectedId={draftCategoryId}
            excludeId={primaryCategoryId}
            onSelect={(id) => {
              if (id !== draftCategoryId) setDraftExpertiseIds([]);
              setDraftCategoryId(id);
            }}
          />
          {draftCategory && (
            <ExpertiseChipPicker
              options={draftCategory.subcategories}
              selectedIds={draftExpertiseIds}
              onChange={setDraftExpertiseIds}
              min={1}
              max={3}
            />
          )}
          <input type="hidden" name="category_id" value={draftCategoryId ?? ""} />
          {draftExpertiseIds.map((id) => (
            <input key={id} type="hidden" name="expertise_ids" value={id} />
          ))}
          {state.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}
          {state.success && <p className="text-sm text-green-700 dark:text-green-500">{state.success}</p>}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={pending}
              className="rounded-md bg-foreground px-4 py-2 text-xs font-medium text-background disabled:opacity-50"
            >
              {pending ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-md border border-black/10 px-4 py-2 text-xs dark:border-white/15"
            >
              Cancel
            </button>
            {draftCategoryId && (
              <button
                type="button"
                onClick={() => {
                  setDraftCategoryId(null);
                  setDraftExpertiseIds([]);
                }}
                className="text-xs text-black/50 underline dark:text-white/50"
              >
                Remove secondary expertise
              </button>
            )}
          </div>
        </form>
      )}
    </Card>
  );
}

function IndustryCard({
  industryGroups,
  initialSelections,
}: {
  industryGroups: IndustryGroupWithIndustries[];
  initialSelections: IndustrySelection[];
}) {
  const [editing, setEditing] = useState(false);
  const [selections, setSelections] = useState<IndustrySelection[]>(initialSelections);
  const [state, formAction, pending] = useActionState(updateIndustries, emptyActionState);
  const allIndustries = useMemo(() => industryGroups.flatMap((g) => g.industries), [industryGroups]);

  return (
    <Card
      title="Industry Experience"
      action={
        !editing && (
          <button type="button" onClick={() => setEditing(true)} className="text-xs underline">
            Edit industries
          </button>
        )
      }
    >
      {!editing ? (
        <div className="flex flex-wrap gap-1.5">
          {initialSelections.length === 0 && (
            <p className="text-sm text-black/50 dark:text-white/50">No industries selected.</p>
          )}
          {initialSelections.map((s) => (
            <span key={s.industryId} className="rounded-full bg-black/5 px-2.5 py-1 text-xs dark:bg-white/10">
              {allIndustries.find((i) => i.id === s.industryId)?.name ?? s.industryId}
            </span>
          ))}
        </div>
      ) : (
        <form action={formAction} className="flex flex-col gap-3">
          <IndustryPicker groups={industryGroups} selections={selections} onChange={setSelections} max={8} />
          <input type="hidden" name="industries_json" value={JSON.stringify(selections)} />
          {state.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}
          {state.success && <p className="text-sm text-green-700 dark:text-green-500">{state.success}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-md bg-foreground px-4 py-2 text-xs font-medium text-background disabled:opacity-50"
            >
              {pending ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-md border border-black/10 px-4 py-2 text-xs dark:border-white/15"
            >
              Close
            </button>
          </div>
        </form>
      )}
    </Card>
  );
}

function EditTopicForm({ topic, onClose }: { topic: BookableTopic; onClose: () => void }) {
  const [state, formAction, pending] = useActionState(updateBookableTopic, emptyActionState);
  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={topic.id} />
      <input
        name="title"
        defaultValue={topic.title}
        className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
      />
      <textarea
        name="description"
        defaultValue={topic.description}
        rows={2}
        className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
      />
      {state.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-foreground px-4 py-2 text-xs font-medium text-background disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-black/10 px-4 py-2 text-xs dark:border-white/15"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function BookableTopicsCard({
  topics,
  expertiseOptions,
  industryOptions,
}: {
  topics: BookableTopic[];
  expertiseOptions: { id: string; name: string }[];
  industryOptions: { id: string; name: string }[];
}) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [createState, createAction, createPending] = useActionState(createBookableTopic, emptyActionState);

  const sorted = [...topics].sort((a, b) => a.sort_order - b.sort_order);

  function orderWithSwap(index: number, direction: -1 | 1): string[] | null {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sorted.length) return null;
    const reordered = sorted.map((t) => t.id);
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    return reordered;
  }

  return (
    <Card
      title="Bookable Topics"
      action={
        !adding &&
        sorted.length < 6 &&
        expertiseOptions.length > 0 && (
          <button type="button" onClick={() => setAdding(true)} className="text-xs underline">
            + Add topic
          </button>
        )
      }
    >
      {sorted.length === 0 && !adding && (
        <p className="text-sm text-black/50 dark:text-white/50">No bookable topics yet.</p>
      )}
      {sorted.length > 0 && (
        <ul className="flex flex-col gap-2">
          {sorted.map((t, index) => (
            <li key={t.id} className="rounded-md border border-black/10 p-3 text-sm dark:border-white/15">
              {editingId === t.id ? (
                <EditTopicForm topic={t} onClose={() => setEditingId(null)} />
              ) : (
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">
                      {t.title}
                      {!t.active && <span className="ml-1 text-black/40 dark:text-white/40">(disabled)</span>}
                    </p>
                    <p className="mt-0.5 text-black/60 dark:text-white/60">{t.description}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5 text-xs">
                    <div className="flex gap-2">
                      <form action={reorderBookableTopics}>
                        {(orderWithSwap(index, -1) ?? []).map((id) => (
                          <input key={id} type="hidden" name="ordered_ids" value={id} />
                        ))}
                        <button type="submit" disabled={index === 0} className="underline disabled:opacity-30">
                          Move up
                        </button>
                      </form>
                      <form action={reorderBookableTopics}>
                        {(orderWithSwap(index, 1) ?? []).map((id) => (
                          <input key={id} type="hidden" name="ordered_ids" value={id} />
                        ))}
                        <button
                          type="submit"
                          disabled={index === sorted.length - 1}
                          className="underline disabled:opacity-30"
                        >
                          Move down
                        </button>
                      </form>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setEditingId(t.id)} className="underline">
                        Edit
                      </button>
                      <form action={toggleBookableTopicActive}>
                        <input type="hidden" name="id" value={t.id} />
                        <input type="hidden" name="active" value={String(t.active)} />
                        <button type="submit" className="underline">
                          {t.active ? "Disable" : "Enable"}
                        </button>
                      </form>
                      <form action={deleteBookableTopic}>
                        <input type="hidden" name="id" value={t.id} />
                        <button type="submit" className="underline">
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {adding && (
        <form
          action={createAction}
          className="mt-3 flex flex-col gap-2 rounded-md border border-black/10 p-3 dark:border-white/15"
        >
          <input
            name="title"
            placeholder="Topic title (e.g. Build My Go-to-Market Strategy)"
            className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
          />
          <textarea
            name="description"
            rows={2}
            placeholder="Short description of what you'll help with"
            className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
          />
          <select
            name="expertise_topic_id"
            className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
          >
            {expertiseOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
          {industryOptions.length > 0 && (
            <select
              name="industry_id"
              className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
            >
              <option value="">Any industry (optional)</option>
              {industryOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          )}
          {createState.error && <p className="text-sm text-red-600 dark:text-red-400">{createState.error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={createPending}
              className="rounded-md bg-foreground px-4 py-2 text-xs font-medium text-background disabled:opacity-50"
            >
              {createPending ? "Adding…" : "Add"}
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="rounded-md border border-black/10 px-4 py-2 text-xs dark:border-white/15"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </Card>
  );
}

export function ExpertiseManager({
  categoryTree,
  industryGroups,
  primaryCategoryId,
  primaryExpertiseIds,
  secondaryCategoryId,
  secondaryExpertiseIds,
  industrySelections,
  bookableTopics,
  pendingChangeRequests,
}: {
  categoryTree: ExpertiseCategoryGroup[];
  industryGroups: IndustryGroupWithIndustries[];
  primaryCategoryId: string | null;
  primaryExpertiseIds: string[];
  secondaryCategoryId: string | null;
  secondaryExpertiseIds: string[];
  industrySelections: IndustrySelection[];
  bookableTopics: BookableTopic[];
  pendingChangeRequests: PendingChangeRequest[];
}) {
  const primaryCategory = categoryTree.find((c) => c.id === primaryCategoryId);
  const secondaryCategory = categoryTree.find((c) => c.id === secondaryCategoryId);
  const topicExpertiseOptions = [
    ...(primaryCategory?.subcategories.filter((s) => primaryExpertiseIds.includes(s.id)) ?? []),
    ...(secondaryCategory?.subcategories.filter((s) => secondaryExpertiseIds.includes(s.id)) ?? []),
  ];
  const allIndustries = industryGroups.flatMap((g) => g.industries);

  const pendingPrimary = pendingChangeRequests.find((r) => r.change_type === "primary_category");
  const pendingSecondary = pendingChangeRequests.find((r) => r.change_type === "secondary_category");

  return (
    <div className="flex flex-col gap-4">
      <PrimaryExpertiseCard
        categoryTree={categoryTree}
        primaryCategoryId={primaryCategoryId}
        primaryExpertiseIds={primaryExpertiseIds}
        secondaryCategoryId={secondaryCategoryId}
        pendingRequest={pendingPrimary}
      />
      <SecondaryExpertiseCard
        categoryTree={categoryTree}
        primaryCategoryId={primaryCategoryId}
        secondaryCategoryId={secondaryCategoryId}
        secondaryExpertiseIds={secondaryExpertiseIds}
        pendingRequest={pendingSecondary}
      />
      <IndustryCard industryGroups={industryGroups} initialSelections={industrySelections} />
      <BookableTopicsCard
        topics={bookableTopics}
        expertiseOptions={topicExpertiseOptions}
        industryOptions={allIndustries}
      />
    </div>
  );
}
