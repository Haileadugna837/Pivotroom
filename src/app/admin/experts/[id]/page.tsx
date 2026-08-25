import { notFound } from "next/navigation";
import { getExpertByIdForAdmin, getCategoriesForAdmin } from "@/features/admin/server/queries";
import { ExpertEditForm } from "@/features/admin/components/expert-edit-form";

export default async function AdminExpertEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [expert, categories] = await Promise.all([
    getExpertByIdForAdmin(id),
    getCategoriesForAdmin(),
  ]);

  if (!expert) notFound();

  return (
    <div className="mx-auto max-w-lg bg-pivot-paper px-6 py-10">
      <h1 className="mb-2 text-xl font-semibold text-pivot-ink">{expert.profile?.full_name ?? expert.profile?.email}</h1>
      <p className="mb-6 text-sm text-pivot-muted">
        Status: {expert.status} · {expert.profile?.email}
      </p>
      <ExpertEditForm expertId={expert.id} categories={categories} initialValues={expert} />
    </div>
  );
}
