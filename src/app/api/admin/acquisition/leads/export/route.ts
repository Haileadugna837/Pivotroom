import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { getUser } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import { getAllLeadsForExport } from "@/features/acquisition/server/admin-queries";
import { acquisitionCategoryLabel } from "@/features/acquisition/config";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const params = request.nextUrl.searchParams;
  const rows = await getAllLeadsForExport({
    dateFrom: params.get("from") ?? undefined,
    dateTo: params.get("to") ?? undefined,
    status: params.get("status") ?? undefined,
    category: params.get("category") ?? undefined,
    source: params.get("source") ?? undefined,
    hasProblem: params.get("has_problem") === "1",
    q: params.get("q") ?? undefined,
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Leads");

  sheet.columns = [
    { header: "Name", key: "name", width: 20 },
    { header: "Phone", key: "phone", width: 16 },
    { header: "Email", key: "email", width: 24 },
    { header: "Categories", key: "categories", width: 30 },
    { header: "Problem", key: "problem", width: 30 },
    { header: "Referral Source", key: "source", width: 16 },
    { header: "UTM Campaign", key: "campaign", width: 18 },
    { header: "Referral Count", key: "referralCount", width: 12 },
    { header: "Nominations", key: "nominations", width: 12 },
    { header: "Status", key: "status", width: 14 },
    { header: "Registration Date", key: "createdAt", width: 18 },
  ];
  sheet.getRow(1).font = { bold: true };

  for (const row of rows) {
    sheet.addRow({
      name: row.name,
      phone: row.raw_phone ?? "",
      email: row.email ?? "",
      categories: row.categories_requested.map(acquisitionCategoryLabel).join(", "),
      problem: row.problem_text ?? "",
      source: row.utm_source ?? "",
      campaign: row.utm_campaign ?? "",
      referralCount: row.referralCount,
      nominations: row.nominationCount,
      status: row.status,
      createdAt: new Date(row.created_at).toISOString().slice(0, 10),
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const filename = `pivotroom-leads-${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
