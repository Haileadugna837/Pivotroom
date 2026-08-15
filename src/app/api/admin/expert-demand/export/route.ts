import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { getUser } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import { getAllFinderSessionsForExport } from "@/features/finder/server/admin-queries";
import { identityLabel } from "@/features/finder/config";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const params = request.nextUrl.searchParams;
  const rows = await getAllFinderSessionsForExport({
    dateFrom: params.get("from") ?? undefined,
    dateTo: params.get("to") ?? undefined,
    identity: params.get("identity") ?? undefined,
    problem: params.get("problem") ?? undefined,
    categoryId: params.get("category") ?? undefined,
    resultStatus: params.get("result") ?? undefined,
    status: params.get("status") ?? undefined,
    source: params.get("source") ?? undefined,
    q: params.get("q") ?? undefined,
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Expert Demand");

  sheet.columns = [
    { header: "Session ID", key: "sessionId", width: 24 },
    { header: "Started Date", key: "startedDate", width: 14 },
    { header: "Started Time", key: "startedTime", width: 12 },
    { header: "Last Activity", key: "lastActivity", width: 22 },
    { header: "Identity", key: "identity", width: 22 },
    { header: "Need / Problem", key: "problem", width: 24 },
    { header: "Category", key: "category", width: 22 },
    { header: "Matching Expert Count", key: "matchCount", width: 12 },
    { header: "Match Status", key: "matchStatus", width: 14 },
    { header: "Name", key: "name", width: 18 },
    { header: "Phone", key: "phone", width: 16 },
    { header: "Lead Submitted", key: "leadSubmitted", width: 12 },
    { header: "Journey Status", key: "status", width: 16 },
    { header: "Source Page", key: "sourcePage", width: 16 },
    { header: "Device Type", key: "deviceType", width: 12 },
  ];
  sheet.getRow(1).font = { bold: true };

  for (const row of rows) {
    const started = new Date(row.started_at);
    sheet.addRow({
      sessionId: row.session_id,
      startedDate: started.toISOString().slice(0, 10),
      startedTime: started.toISOString().slice(11, 19),
      lastActivity: new Date(row.last_activity_at).toISOString(),
      identity: identityLabel(row.identity) ?? row.identity ?? "",
      problem: row.problem ? row.problem.replace(/_/g, " ") : "",
      category: (row.categories as { name: string } | null)?.name ?? "",
      matchCount: row.match_count ?? "",
      matchStatus: row.match_status ?? "",
      name: row.name ?? "",
      phone: row.phone ?? "",
      leadSubmitted: row.lead_submitted ? "Yes" : "No",
      status: row.status,
      sourcePage: row.source_page ?? "",
      deviceType: row.device_type ?? "",
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const filename = `pivotroom-expert-demand-${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
