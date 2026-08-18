import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { getUser } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import { getAllApplicationsForExport } from "@/features/acquisition/server/admin-queries";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const params = request.nextUrl.searchParams;
  const rows = await getAllApplicationsForExport({
    dateFrom: params.get("from") ?? undefined,
    dateTo: params.get("to") ?? undefined,
    status: params.get("status") ?? undefined,
    professionalType: params.get("type") ?? undefined,
    q: params.get("q") ?? undefined,
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Founding Expert Applications");

  sheet.columns = [
    { header: "Name", key: "name", width: 20 },
    { header: "Phone", key: "phone", width: 16 },
    { header: "Email", key: "email", width: 24 },
    { header: "Professional Type", key: "type", width: 16 },
    { header: "Current Role", key: "role", width: 20 },
    { header: "Company", key: "company", width: 20 },
    { header: "Expertise", key: "expertise", width: 30 },
    { header: "Experience Description", key: "experience", width: 40 },
    { header: "LinkedIn", key: "linkedin", width: 24 },
    { header: "Website", key: "website", width: 24 },
    { header: "Instagram", key: "instagram", width: 24 },
    { header: "Status", key: "status", width: 14 },
    { header: "Source", key: "source", width: 14 },
    { header: "Application Date", key: "createdAt", width: 18 },
  ];
  sheet.getRow(1).font = { bold: true };

  for (const row of rows) {
    sheet.addRow({
      name: row.name,
      phone: row.raw_phone ?? "",
      email: row.email ?? "",
      type: row.professional_type,
      role: row.current_role ?? "",
      company: row.current_company ?? "",
      expertise: row.expertise_topics.join(", "),
      experience: row.experience_text,
      linkedin: row.linkedin_url ?? "",
      website: row.website_url ?? "",
      instagram: row.instagram_url ?? "",
      status: row.status,
      source: row.utm_source ?? "",
      createdAt: new Date(row.created_at).toISOString().slice(0, 10),
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const filename = `pivotroom-founding-expert-applications-${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
