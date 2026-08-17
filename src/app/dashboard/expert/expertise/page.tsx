import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { getMyExpertProfile } from "@/features/experts/server/self";
import {
  getExpertiseCategoryTree,
  getMyExpertiseSelections,
  getPendingChangeRequests,
} from "@/features/experts/server/expertise";
import { getIndustryDirectory, getMyIndustrySelections } from "@/features/experts/server/industries";
import { getMyBookableTopics } from "@/features/experts/server/bookable-topics";
import { ExpertiseManager } from "@/features/experts/components/expertise-manager";

export const metadata: Metadata = {
  title: "Expertise",
  robots: { index: false, follow: false },
};

export default async function ExpertExpertisePage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const expertProfile = await getMyExpertProfile(user.id);
  if (!expertProfile) redirect("/dashboard/expert/profile");

  const [categoryTree, industryGroups, selections, industrySelections, bookableTopics, pendingChangeRequests] =
    await Promise.all([
      getExpertiseCategoryTree(),
      getIndustryDirectory(),
      getMyExpertiseSelections(user.id),
      getMyIndustrySelections(user.id),
      getMyBookableTopics(user.id),
      getPendingChangeRequests(user.id),
    ]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-2 text-xl font-semibold">Expertise</h1>
      <p className="mb-6 text-sm text-black/50 dark:text-white/50">
        How clients find and understand what you can help with.
      </p>

      {selections.untypedExpertiseIds.length > 0 && (
        <p className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
          Some of your older expertise tags couldn&apos;t be automatically sorted into primary/secondary — they still
          count toward your marketplace visibility. Set your Primary and Secondary Expertise below to clean this up.
        </p>
      )}

      <ExpertiseManager
        categoryTree={categoryTree}
        industryGroups={industryGroups}
        primaryCategoryId={selections.primaryCategoryId}
        primaryExpertiseIds={selections.primaryExpertiseIds}
        secondaryCategoryId={selections.secondaryCategoryId}
        secondaryExpertiseIds={selections.secondaryExpertiseIds}
        industrySelections={industrySelections}
        bookableTopics={bookableTopics}
        pendingChangeRequests={pendingChangeRequests}
      />
    </div>
  );
}
